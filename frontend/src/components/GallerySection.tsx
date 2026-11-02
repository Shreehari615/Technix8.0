"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { galleryData } from "@/data/galleryData";
import { coordinatorsData, CoordinatorProfile } from "@/data/coordinatorsData";
import { GalleryItem } from "@/types";
import {
  Users,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
  Mail,
  MapPin,
  Shield,
  Search,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function GallerySection() {
  const [activeTab, setActiveTab] = useState<"coordinators" | "photos">("coordinators");

  // Coordinators State
  const [coordCategory, setCoordCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCoord, setSelectedCoord] = useState<CoordinatorProfile | null>(null);

  // Photos State
  const [photoCategory, setPhotoCategory] = useState<string>("All");
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const coordCategories = ["All", "Leadership", "Faculty", "Core Committee", "Event Leads"];
  const photoCategories = ["All", "Technical", "Cultural", "Gaming", "Behind The Scenes"];

  // Filter Coordinators
  const filteredCoordinators = useMemo(() => {
    return coordinatorsData.filter((coord) => {
      const matchesCategory = coordCategory === "All" || coord.category === coordCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        coord.name.toLowerCase().includes(q) ||
        coord.role.toLowerCase().includes(q) ||
        coord.departmentOrEvent.toLowerCase().includes(q) ||
        coord.heroCodename.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [coordCategory, searchQuery]);

  // Filter Photos
  const filteredPhotos = useMemo(() => {
    return galleryData.filter((item) =>
      photoCategory === "All" ? true : item.category === photoCategory
    );
  }, [photoCategory]);

  // Lightbox keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activePhoto) return;
      if (e.key === "Escape") setActivePhoto(null);
      if (e.key === "ArrowLeft") handlePhotoPrev();
      if (e.key === "ArrowRight") handlePhotoNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto, filteredPhotos]);

  const handlePhotoPrev = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((i) => i.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  const handlePhotoNext = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex((i) => i.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  return (
    <section id="gallery" className="relative py-20 px-4 bg-transparent overflow-hidden">
      {/* Background Ambience: Subtle Cosmic Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ================================================================= */}
        {/* SECTION HEADER                                                    */}
        {/* ================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-red-500/30 text-red-400 font-mono-code text-xs tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            TECHNIX MULTIVERSE DOSSIER
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white tracking-tight mb-4 drop-shadow-md">
            GALLERY &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-500">COORDINATORS</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Meet the visionaries, faculty guardians, and student commanders powering TECHNIX 8.0 alongside moments from our previous festival editions.
          </p>

          {/* Primary View Switcher: Coordinators vs Moments */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl mt-8">
            <button
              onClick={() => setActiveTab("coordinators")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === "coordinators"
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-950 border border-red-400/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              COORDINATORS SHOWCASE ({coordinatorsData.length})
            </button>

            <button
              onClick={() => setActiveTab("photos")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === "photos"
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-950 border border-red-400/40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Camera className="w-4 h-4" />
              FEST MOMENTS GALLERY ({galleryData.length})
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* VIEW 1: COORDINATORS SHOWCASE                                     */}
        {/* ================================================================= */}
        {activeTab === "coordinators" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Search & Filter Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 backdrop-blur-md">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {coordCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCoordCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-tech font-bold tracking-wider uppercase transition-all cursor-pointer ${
                      coordCategory === cat
                        ? "bg-red-600 text-white shadow-md shadow-red-950 border border-red-400/60"
                        : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search coordinator, arena..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Coordinators Grid */}
            {filteredCoordinators.length === 0 ? (
              <div className="py-16 text-center text-slate-400 font-mono-code text-sm">
                No coordinators match your search criteria. Try a different filter or keyword.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCoordinators.map((coord) => (
                  <div
                    key={coord.id}
                    className="group relative rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800/90 hover:border-red-500/70 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-red-950/20 flex flex-col overflow-hidden"
                  >
                    {/* Top Decorative Header Accent */}
                    <div
                      className="h-1.5 w-full"
                      style={{ backgroundColor: coord.badgeColor || "#EF4444" }}
                    />

                    {/* Image and Badges Container */}
                    <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-slate-950">
                      <Image
                        src={coord.photo}
                        alt={`${coord.name} - ${coord.role}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
                      />

                      {/* Dark Vignette Bottom Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono-code uppercase font-bold text-amber-300 shadow">
                          {coord.category}
                        </span>

                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono-code font-bold uppercase shadow"
                          style={{
                            backgroundColor: `${coord.badgeColor || "#EF4444"}25`,
                            color: coord.badgeColor || "#EF4444",
                            border: `1px solid ${coord.badgeColor || "#EF4444"}60`,
                          }}
                        >
                          {coord.heroCodename}
                        </span>
                      </div>

                      {/* Bottom Image Overlay: Name & Role */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-heading text-lg sm:text-xl font-black text-white drop-shadow-md">
                          {coord.name}
                        </h3>
                        <p
                          className="font-mono-code text-xs font-semibold tracking-wide"
                          style={{ color: coord.badgeColor || "#F87171" }}
                        >
                          {coord.role}
                        </p>
                      </div>
                    </div>

                    {/* Coordinator Details Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5 bg-slate-950/80 border-t border-slate-900">
                      <div>
                        {/* Domain / Event Pill */}
                        <div className="text-xs font-tech font-bold text-slate-200 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-lg mb-2 truncate">
                          {coord.departmentOrEvent}
                        </div>

                        {/* Bio or Summary */}
                        {coord.bio && (
                          <p className="text-slate-400 text-xs font-sans leading-relaxed line-clamp-2">
                            {coord.bio}
                          </p>
                        )}
                      </div>

                      {/* Coordinates & Actions */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        {coord.coordinates && (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                            <span className="truncate">{coord.coordinates}</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-1">
                          {coord.phone ? (
                            <a
                              href={`tel:${coord.phone.replace(/\s+/g, "")}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 border border-slate-800 hover:border-emerald-500/40 text-xs font-mono-code font-bold transition-all"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>CALL</span>
                            </a>
                          ) : (
                            <span className="flex-1" />
                          )}

                          {coord.email && (
                            <a
                              href={`mailto:${coord.email}`}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-red-600/20 text-slate-300 hover:text-red-400 border border-slate-800 hover:border-red-500/40 text-xs font-mono-code font-bold transition-all"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>EMAIL</span>
                            </a>
                          )}

                          <button
                            onClick={() => setSelectedCoord(coord)}
                            title="View Full Profile"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: FEST MOMENTS GALLERY                                      */}
        {/* ================================================================= */}
        {activeTab === "photos" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {photoCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPhotoCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-tech font-bold tracking-wide transition-all cursor-pointer ${
                    photoCategory === cat
                      ? "bg-red-600 text-white shadow-lg shadow-red-950 glow-red border border-red-400/60"
                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Masonry / Grid Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPhotos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActivePhoto(item)}
                  className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 hover:border-red-500/60 cursor-pointer shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="relative w-full h-64 sm:h-72">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Category Pill */}
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono-code text-amber-300">
                      {item.category}
                    </div>

                    {/* Inspect Overlay Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg shadow-red-950 glow-red">
                        <Eye className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Title & Caption Bar */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="font-heading text-sm font-bold text-white truncate drop-shadow">
                        {item.title}
                      </h4>
                      <span className="font-mono-code text-[10px] text-slate-400 block mt-0.5">
                        {item.year}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* COORDINATOR PROFILE MODAL                                         */}
      {/* ================================================================= */}
      {selectedCoord && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedCoord(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCoord(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 hover:bg-red-600 text-slate-400 hover:text-white transition-colors border border-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Photo */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-red-500/50 shadow-xl flex-shrink-0">
                <Image
                  src={selectedCoord.photo}
                  alt={selectedCoord.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text Information */}
              <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 border border-red-500/30 text-red-400 text-[10px] font-mono-code font-bold uppercase">
                  <Shield className="w-3 h-3" />
                  {selectedCoord.heroCodename}
                </div>

                <h3 className="font-heading text-2xl font-black text-white">
                  {selectedCoord.name}
                </h3>

                <p className="font-mono-code text-xs text-amber-400 font-semibold">
                  {selectedCoord.role}
                </p>

                <p className="font-tech text-xs text-slate-300">
                  {selectedCoord.departmentOrEvent}
                </p>
              </div>
            </div>

            {selectedCoord.bio && (
              <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {selectedCoord.bio}
                </p>
              </div>
            )}

            {/* Coordinates and Contact Links */}
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
              {selectedCoord.coordinates && (
                <div className="flex items-center gap-2 text-xs font-mono-code text-slate-400">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>COORDINATES: {selectedCoord.coordinates}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {selectedCoord.phone && (
                  <a
                    href={`tel:${selectedCoord.phone.replace(/\s+/g, "")}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono-code text-xs font-bold transition-all shadow-lg shadow-red-950"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{selectedCoord.phone}</span>
                  </a>
                )}

                {selectedCoord.email && (
                  <a
                    href={`mailto:${selectedCoord.email}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono-code text-xs font-bold transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>EMAIL DIRECT</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* PHOTO LIGHTBOX MODAL                                              */}
      {/* ================================================================= */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-in fade-in duration-200"
          onClick={() => setActivePhoto(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-slate-900/80 hover:bg-red-600 text-white transition-colors border border-slate-700 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePhotoPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-colors border border-slate-700 cursor-pointer"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePhotoNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white transition-colors border border-slate-700 cursor-pointer"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center"
          >
            <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
              <Image
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-4 text-center max-w-xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-slate-900 text-[10px] font-mono-code text-amber-400 mb-1 border border-slate-800">
                {activePhoto.category} • {activePhoto.year}
              </div>
              <h3 className="font-heading text-lg font-bold text-white">
                {activePhoto.title}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                {activePhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
