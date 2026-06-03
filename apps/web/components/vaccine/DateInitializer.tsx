"use client";

import { VaccineProfile } from "@/lib/vaccineData";
import { Calendar } from "lucide-react";

interface DateInitializerProps {
    vaccine: VaccineProfile;
    value: string;
    onChange: (date: string) => void;
}

export function DateInitializer({ vaccine, value, onChange }: DateInitializerProps) {
    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-800 uppercase">
                <Calendar size={14} aria-hidden="true" />
                {vaccine.is_relative_to_birth ? "Child's Birth Date" : "First Dose Date"}
            </label>

            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-medium text-slate-900 shadow-sm transition-all outline-none hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                aria-label={
                    vaccine.is_relative_to_birth
                        ? "Enter child's birth date"
                        : "Enter first dose date"
                }
                max={new Date().toISOString().split("T")[0]}
            />

            {value && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    📅{" "}
                    {new Date(value).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            )}
        </div>
    );
}
