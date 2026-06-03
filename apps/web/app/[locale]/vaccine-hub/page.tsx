"use client";

import { PageHeader } from "../components/PageHeader";
import { useState, useEffect } from "react";
import { vaccineDatabase, VaccineKey, VACCINE_GLOBAL_DISCLAIMER } from "@/lib/vaccineData";
import {
    VaccineSelector,
    DoseSchedule,
    VaccineDetails,
    SafetyInfo,
    AftercareGuidance,
    DateInitializer,
} from "@/components/vaccine";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookOpen } from "lucide-react";

const STORAGE_KEYS = {
    selectedVaccine: "vaccine-hub-selected-vaccine",
    initialDate: "vaccine-hub-initial-date",
};

export default function VaccineHubPage() {
    const [selectedVaccine, setSelectedVaccine] = useState<VaccineKey | "">("");
    const [initialDate, setInitialDate] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    const vaccine = selectedVaccine ? vaccineDatabase[selectedVaccine] : null;

    // Load from localStorage on mount
    useEffect(() => {
        const savedVaccine = localStorage.getItem(STORAGE_KEYS.selectedVaccine);
        const savedDate = localStorage.getItem(STORAGE_KEYS.initialDate);

        if (savedVaccine && Object.keys(vaccineDatabase).includes(savedVaccine)) {
            setSelectedVaccine(savedVaccine as VaccineKey);
        }

        if (savedDate) {
            setInitialDate(savedDate);
        }

        setIsLoading(false);
    }, []);

    // Persist vaccine selection to localStorage
    const handleVaccineChange = (vaccine: VaccineKey | "") => {
        setSelectedVaccine(vaccine);
        if (vaccine) {
            localStorage.setItem(STORAGE_KEYS.selectedVaccine, vaccine);
        } else {
            localStorage.removeItem(STORAGE_KEYS.selectedVaccine);
        }
        setInitialDate(""); // Clear date when switching vaccines
        localStorage.removeItem(STORAGE_KEYS.initialDate);
    };

    // Persist date to localStorage
    const handleDateChange = (date: string) => {
        setInitialDate(date);
        if (date) {
            localStorage.setItem(STORAGE_KEYS.initialDate, date);
        } else {
            localStorage.removeItem(STORAGE_KEYS.initialDate);
        }
    };

    if (isLoading) {
        return (
            <>
                <PageHeader
                    title="Vaccine Hub"
                    subtitle="Immunization Tracker"
                    backHref="/"
                    variant="light"
                />
                <div className="min-h-screen bg-slate-50 p-6 md:p-10 dark:bg-slate-900">
                    <div className="mx-auto max-w-6xl animate-pulse space-y-6">
                        <div className="h-32 rounded-lg bg-slate-200 dark:bg-slate-700" />
                        <div className="h-64 rounded-lg bg-slate-200 dark:bg-slate-700" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageHeader
                title="Vaccine Hub"
                subtitle="Immunization Tracker"
                backHref="/"
                variant="light"
            />

            <div className="min-h-screen bg-slate-50 p-4 transition-colors duration-200 sm:p-6 md:p-10 dark:bg-slate-900">
                <div className="mx-auto max-w-7xl space-y-8">
                    {/* Hero Section */}
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">
                            💉 Vaccine Hub & Immunization Tracker
                        </h1>
                        <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-300">
                            Explore vaccine schedules, safety information, and aftercare guidance
                            for better public health awareness.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 dark:border-slate-700 dark:bg-slate-800">
                        <div>
                            <VaccineSelector
                                value={selectedVaccine}
                                onChange={handleVaccineChange}
                            />
                        </div>

                        {vaccine && (
                            <div>
                                <DateInitializer
                                    vaccine={vaccine}
                                    value={initialDate}
                                    onChange={handleDateChange}
                                />
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {!vaccine && (
                        <div className="py-12">
                            <EmptyState
                                icon={<BookOpen size={32} className="text-emerald-600" />}
                                title="No Vaccine Selected"
                                description="Choose a vaccine above to view detailed information, schedule tracking, safety guidelines, and aftercare instructions."
                                className="mx-auto max-w-md"
                            />

                            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-lg border border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                                    <p className="mb-2 text-2xl">📅</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Schedule Tracking
                                    </p>
                                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                        Calculate projected doses
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                                    <p className="mb-2 text-2xl">⚠️</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Safety Info
                                    </p>
                                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                        Common & severe reactions
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                                    <p className="mb-2 text-2xl">🩹</p>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Aftercare
                                    </p>
                                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                                        Step-by-step guidance
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    {vaccine && (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Left Column - Sticky Details */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-20 space-y-6">
                                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                        <VaccineDetails vaccine={vaccine} />
                                    </div>
                                </div>
                            </div>

                            {/* Right Columns - Scrollable Content */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* Dose Schedule */}
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                    <DoseSchedule vaccine={vaccine} initialDate={initialDate} />
                                </div>

                                {/* Safety Info */}
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                    <SafetyInfo vaccine={vaccine} />
                                </div>

                                {/* Aftercare Guidance */}
                                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                    <AftercareGuidance vaccine={vaccine} />
                                </div>

                                {/* Disclaimer */}
                                <div className="border-t border-slate-200 pt-6 text-center dark:border-slate-700">
                                    <p className="text-xs text-slate-500 italic dark:text-slate-400">
                                        {VACCINE_GLOBAL_DISCLAIMER}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
