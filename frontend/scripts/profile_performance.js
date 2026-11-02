const { spawn } = require('child_process');
const http = require('http');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWebSocketDebuggerUrl(port) {
  for (let i = 0; i < 20; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json/version`, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => resolve(JSON.parse(body)));
        }).on('error', reject);
      });
      if (data && data.webSocketDebuggerUrl) {
        return data.webSocketDebuggerUrl;
      }
    } catch (e) {
      await sleep(300);
    }
  }
  throw new Error('Failed to connect to Chrome DevTools');
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result.value;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runProfile(label = 'Baseline') {
  console.log(`\n======================================================`);
  console.log(`RUNNING PERFORMANCE PROFILE: ${label}`);
  console.log(`======================================================\n`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9222;

  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1280,900',
    'about:blank'
  ]);

  try {
    const wsUrl = await getWebSocketDebuggerUrl(port);
    const client = new CDPClient(wsUrl);
    await client.connect();

    // Create a new target page
    const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await client.send('Target.attachToTarget', { targetId, flatten: true });

    // Helper to send session commands
    const sendSession = (method, params = {}) => {
      return client.send('Target.sendMessageToTarget', {
        sessionId,
        message: JSON.stringify({ id: client.id++, method, params })
      });
    };

    // Connect directly to target page
    const targets = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });

    const pageTarget = targets.find(t => t.id === targetId);
    const pageClient = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await pageClient.connect();

    await pageClient.send('Page.enable');
    await pageClient.send('Runtime.enable');
    await pageClient.send('Performance.enable');

    console.log(`[1] Navigating to http://localhost:3000/events ...`);
    const navStart = Date.now();
    await pageClient.send('Page.navigate', { url: 'http://localhost:3000/events' });

    // Wait for network/page idle
    await sleep(2500);
    const navEnd = Date.now();
    console.log(`[1] Navigation & initial render completed in ${navEnd - navStart}ms`);

    // Performance Metrics from CDP
    const cdpMetrics = await pageClient.send('Performance.getMetrics');
    const metricMap = {};
    for (const m of cdpMetrics.metrics) {
      metricMap[m.name] = m.value;
    }

    console.log(`\n--- CDP Performance Metrics (Initial Load) ---`);
    console.log(`JS Heap Used Size: ${(metricMap.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`JS Heap Total Size: ${(metricMap.JSHeapTotalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Layout Duration: ${(metricMap.LayoutDuration * 1000).toFixed(2)} ms`);
    console.log(`Recalc Style Duration: ${(metricMap.RecalcStyleDuration * 1000).toFixed(2)} ms`);
    console.log(`Script Duration: ${(metricMap.ScriptDuration * 1000).toFixed(2)} ms`);
    console.log(`DOM Node Count: ${metricMap.Nodes}`);
    console.log(`JS Event Listeners: ${metricMap.JSEventListeners}`);

    // Browser Timing & Navigation Entries
    const browserTiming = await pageClient.evaluate(`(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const fp = paint.find(p => p.name === 'first-paint')?.startTime || 0;
      const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
      
      const resources = performance.getEntriesByType('resource');
      let totalImageSize = 0;
      let imageCount = 0;
      resources.forEach(r => {
        if (r.initiatorType === 'img' || r.name.match(/\\.(png|jpg|jpeg|webp|svg)/i)) {
          totalImageSize += r.transferSize || r.encodedBodySize || 0;
          imageCount++;
        }
      });

      return {
        domInteractive: nav ? nav.domInteractive : 0,
        domComplete: nav ? nav.domComplete : 0,
        loadEventEnd: nav ? nav.loadEventEnd : 0,
        firstPaint: Math.round(fp),
        fcp: Math.round(fcp),
        imageCount,
        totalImageSizeKB: Math.round(totalImageSize / 1024)
      };
    })()`);

    console.log(`\n--- Web Vitals & Resource Metrics ---`);
    console.log(`First Paint: ${browserTiming.firstPaint} ms`);
    console.log(`First Contentful Paint (FCP): ${browserTiming.fcp} ms`);
    console.log(`DOM Complete: ${Math.round(browserTiming.domComplete)} ms`);
    console.log(`Image Resources Loaded: ${browserTiming.imageCount} images (${browserTiming.totalImageSizeKB} KB)`);

    // [2] TEST SCROLL PERFORMANCE & FPS
    console.log(`\n[2] Profiling Scroll Performance & FPS drop...`);
    const scrollStats = await pageClient.evaluate(`(async () => {
      return new Promise((resolve) => {
        let frameCount = 0;
        let lastTime = performance.now();
        const frameDeltas = [];
        let jankFrames = 0; // frames taking > 24ms (~ < 40fps)

        function onFrame(now) {
          const delta = now - lastTime;
          lastTime = now;
          frameCount++;
          frameDeltas.push(delta);
          if (delta > 24) jankFrames++;

          if (frameCount < 60) {
            window.scrollBy(0, 30);
            requestAnimationFrame(onFrame);
          } else {
            const avgDelta = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length;
            const fps = Math.round(1000 / avgDelta);
            const maxDelta = Math.round(Math.max(...frameDeltas));
            resolve({ fps, jankFrames, maxDelta, totalFrames: frameCount });
          }
        }

        requestAnimationFrame(onFrame);
      });
    })()`);

    console.log(`Scroll Average FPS: ${scrollStats.fps} FPS`);
    console.log(`Jank Frames (>24ms per frame): ${scrollStats.jankFrames} / ${scrollStats.totalFrames}`);
    console.log(`Max Frame Time: ${scrollStats.maxDelta} ms`);

    // [3] TEST SEARCH INPUT INTERACTION LATENCY
    console.log(`\n[3] Profiling Search Keystroke Latency & Re-render cost...`);
    const searchStats = await pageClient.evaluate(`(async () => {
      const input = document.querySelector('input[placeholder*="Search"]');
      if (!input) return { error: 'Search input not found' };

      const keyTimes = [];
      const query = 'Iron';

      for (const char of query) {
        const t0 = performance.now();
        input.value += char;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        
        // Force style/layout flush to measure synchronous work
        document.body.getBoundingClientRect();
        const t1 = performance.now();
        keyTimes.push(t1 - t0);
        await new Promise(r => setTimeout(r, 60));
      }

      const avgKeyTime = keyTimes.reduce((a, b) => a + b, 0) / keyTimes.length;
      const cardsVisible = document.querySelectorAll('[data-event-id]').length;
      return { avgKeyTimeMs: avgKeyTime.toFixed(2), maxKeyTimeMs: Math.max(...keyTimes).toFixed(2), cardsVisible };
    })()`);

    console.log(`Search Keystroke Processing Time: avg ${searchStats.avgKeyTimeMs} ms, max ${searchStats.maxKeyTimeMs} ms`);
    console.log(`Filtered Cards Rendered: ${searchStats.cardsVisible}`);

    // [4] TEST DOSSIER (EVENT PREVIEW) MODAL OPEN & CLOSE
    console.log(`\n[4] Profiling Dossier Modal Open & Close Latency...`);
    const dossierStats = await pageClient.evaluate(`(async () => {
      const card = document.querySelector('[data-event-id]');
      if (!card) return { error: 'Event card not found' };

      const buttons = Array.from(card.querySelectorAll('button'));
      const dossierBtn = buttons.find(b => b.textContent.includes('DOSSIER'));
      if (!dossierBtn) return { error: 'Dossier button not found' };

      const t0 = performance.now();
      dossierBtn.click();
      await new Promise(r => setTimeout(r, 250));
      const t1 = performance.now();

      const dialog = document.querySelector('[role="dialog"]');
      const opened = Boolean(dialog && dialog.textContent.includes('PROTOCOL'));

      // Close modal
      if (dialog) {
        const closeBtn = dialog.querySelector('button[aria-label*="Close"]') || dialog.querySelector('button');
        if (closeBtn) closeBtn.click();
      }
      await new Promise(r => setTimeout(r, 200));
      const closed = !document.querySelector('[role="dialog"]');

      return { openMs: Math.round(t1 - t0), opened, closed };
    })()`);

    console.log(`Dossier Preview Modal: Open ${dossierStats.openMs} ms (Opened: ${dossierStats.opened}, Closed: ${dossierStats.closed})`);

    // [5] TEST REGISTRATION MODAL OPEN & 3D FLIP PERFORMANCE
    console.log(`\n[5] Profiling Registration Modal Open & 3D Flip Latency...`);
    const modalStats = await pageClient.evaluate(`(async () => {
      // Find the card Register button specifically on the first event card
      const card = document.querySelector('[data-event-id]');
      if (!card) return { error: 'Event card not found' };

      const buttons = Array.from(card.querySelectorAll('button'));
      const regBtn = buttons.find(b => b.textContent.includes('REGISTER'));
      if (!regBtn) return { error: 'Register button not found on card' };

      const t0 = performance.now();
      regBtn.click();

      // Wait for modal in DOM
      await new Promise(r => setTimeout(r, 400));
      const t1 = performance.now();
      const openDuration = Math.round(t1 - t0);

      // Check if modal dialog appeared
      const dialog = document.querySelector('[role="dialog"]');
      const hasHeroCard = Boolean(dialog && dialog.textContent.includes('TECHNIX 8.0'));

      const stage = dialog ? dialog.querySelector('div') : null;
      const rectBefore = stage ? stage.getBoundingClientRect() : null;

      // Trigger flip by clicking FLIP NOW
      const allButtons = Array.from(dialog.querySelectorAll('button'));
      const flipBtn = allButtons.find(b => b.textContent.includes('FLIP NOW'));
      if (flipBtn) flipBtn.click();

      // Wait for 3D flip animation (700ms)
      await new Promise(r => setTimeout(r, 800));

      const rectAfter = stage ? stage.getBoundingClientRect() : null;
      const windowH = window.innerHeight;

      const beforeTop = rectBefore ? Math.round(rectBefore.top) : 0;
      const afterTop = rectAfter ? Math.round(rectAfter.top) : 0;
      const cardHeight = rectAfter ? Math.round(rectAfter.height) : 0;
      const isCentered = afterTop > 20 && (afterTop + cardHeight / 2) > (windowH * 0.4) && (afterTop + cardHeight / 2) < (windowH * 0.6);

      return {
        openDurationMs: openDuration,
        modalOpened: Boolean(dialog),
        hasHeroCard,
        beforeTop,
        afterTop,
        windowH,
        isCentered
      };
    })()`);

    console.log(`Modal Open Duration: ${modalStats.openDurationMs} ms (Success: ${modalStats.modalOpened}, HeroCard: ${modalStats.hasHeroCard})`);
    console.log(`Flip Geometry Check: Before Top=${modalStats.beforeTop}px, After Top=${modalStats.afterTop}px (Viewport=${modalStats.windowH}px) -> Perfectly Centered: ${modalStats.isCentered}`);

    // Get final metrics
    const finalMetrics = await pageClient.send('Performance.getMetrics');
    const finalMap = {};
    for (const m of finalMetrics.metrics) {
      finalMap[m.name] = m.value;
    }
    console.log(`\n--- Post-Interaction Cumulative Metrics ---`);
    console.log(`Cumulative Layout Duration: ${(finalMap.LayoutDuration * 1000).toFixed(2)} ms`);
    console.log(`Cumulative Recalc Style Duration: ${(finalMap.RecalcStyleDuration * 1000).toFixed(2)} ms`);
    console.log(`Cumulative Script Duration: ${(finalMap.ScriptDuration * 1000).toFixed(2)} ms`);

    pageClient.close();
    client.close();
  } finally {
    chromeProcess.kill();
  }
}

const label = process.argv[2] || 'Baseline';
runProfile(label).catch(err => {
  console.error('Profile failed:', err);
  process.exit(1);
});
