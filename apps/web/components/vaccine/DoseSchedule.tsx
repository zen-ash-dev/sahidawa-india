"use client";

import { VaccineProfile } from "@/lib/vaccineData";
import { CheckCircle, AlertCircle, Calendar } from "lucide-react";

interface DoseScheduleProps {
    vaccine: VaccineProfile;
    initialDate: string;
}

export function DoseSchedule({ vaccine, initialDate }: DoseScheduleProps) {
    const calculateMilestoneDate = (weeksOffset: number): string | null => {
        if (!initialDate) return null;

        const reference = new Date(initialDate);
        if (isNaN(reference.getTime())) return null;

        const targetDate = new Date(reference.getTime());
        targetDate.setDate(targetDate.getDate() + weeksOffset * 7);

        return targetDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getDoseLabel = (weeks: number, index: number): string => {
        if (vaccine.is_relative_to_birth) {
            return weeks === 0 ? "At Birth Administration" : `At ${weeks} Weeks of Age`;
        } else {
            return index === 0
                ? "Initial Administration (Baseline)"
                : `Dose Step ${index + 1} (+${weeks} weeks later)`;
        }
    };

    const getDoseStatus = (dateString: string | null): "scheduled" | "pending" | "today" => {
        if (!dateString) return "pending";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const doseDate = new Date(dateString);
        doseDate.setHours(0, 0, 0, 0);

        if (doseDate.getTime() === today.getTime()) return "today";
        if (doseDate.getTime() < today.getTime()) return "scheduled";
        return "pending";
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Calendar size={20} className="text-emerald-600" aria-hidden="true" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Immunization Schedule
                </h3>
            </div>

            {!initialDate && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-900/20">
                    <p className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200">
                        <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span>
                            Select a{" "}
                            {vaccine.is_relative_to_birth ? "birth date" : "first dose date"} above
                            to see projected immunization dates.
                        </span>
                    </p>
                </div>
            )}

            <div className="space-y-3">
                {(vaccine.dosing_intervals_weeks || []).map((weeks, index) => {
                    const dateString = calculateMilestoneDate(weeks);
                    const status = getDoseStatus(dateString);
                    const label = getDoseLabel(weeks, index);

                    return (
                        <div
                            key={index}
                            className={`flex gap-4 rounded-lg border p-4 transition-all ${
                                status === "today"
                                    ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                                    : status === "scheduled"
                                      ? "border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-900/20"
                                      : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                            }`}
                            role="article"
                            aria-label={`Dose ${index + 1}: ${label}`}
                        >
                            {/* Dose Badge */}
                            <div className="flex shrink-0 items-center justify-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full font-bold transition-all ${
                                        status === "today"
                                            ? "border-2 border-emerald-500 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100"
                                            : status === "scheduled"
                                              ? "border-2 border-sky-400 bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-100"
                                              : "border-2 border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                    }`}
                                >
                                    {index + 1}
                                </div>
                            </div>

                            {/* Dose Details */}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {label}
                                        </p>

                                        {dateString ? (
                                            <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${
                                                        status === "today"
                                                            ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
                                                            : status === "scheduled"
                                                              ? "bg-sky-200 text-sky-800 dark:bg-sky-800 dark:text-sky-100"
                                                              : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                                    }`}
                                                >
                                                    {status === "today" && (
                                                        <CheckCircle size={14} aria-hidden="true" />
                                                    )}
                                                    {status === "today"
                                                        ? "TODAY"
                                                        : status === "scheduled"
                                                          ? "SCHEDULED"
                                                          : "UPCOMING"}
                                                </span>
                                                <span
                                                    className={`${
                                                        status === "today"
                                                            ? "text-emerald-700 dark:text-emerald-200"
                                                            : status === "scheduled"
                                                              ? "text-sky-700 dark:text-sky-200"
                                                              : "text-slate-700 dark:text-slate-300"
                                                    }`}
                                                >
                                                    {dateString}
                                                </span>
                                            </p>
                                        ) : (
                                            <p className="mt-1 text-sm text-slate-500 italic dark:text-slate-400">
                                                Enter a date above to calculate this dose date
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Timeline Summary */}
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Summary</h4>
                <dl className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                        <dt className="font-medium">Total Doses:</dt>
                        <dd className="font-semibold text-slate-900 dark:text-white">
                            {vaccine.total_doses}
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="font-medium">Effectiveness:</dt>
                        <dd className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {vaccine.effectiveness}
                        </dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="font-medium">Category:</dt>
                        <dd className="font-semibold text-slate-900 dark:text-white">
                            {vaccine.category}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
