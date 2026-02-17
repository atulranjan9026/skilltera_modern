import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Building2, DollarSign, Clock } from 'lucide-react';
import { THEME_CLASSES } from '../../../../theme';

export const PersonalInfoSection = ({ data, isEditing, onChange }) => {
    return (
        <div className="space-y-6">
            {/* Contact Information */}
            <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Mail size={16} />
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email || ''}
                            onChange={(e) => onChange('email', e.target.value)}
                            disabled={!isEditing}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Phone size={16} />
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={data.phone || ''}
                            onChange={(e) => onChange('phone', e.target.value)}
                            disabled={!isEditing}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <MapPin size={16} />
                            City
                        </label>
                        <input
                            type="text"
                            value={data.currentCity || ''}
                            onChange={(e) => onChange('currentCity', e.target.value)}
                            disabled={!isEditing}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <MapPin size={16} />
                            Country
                        </label>
                        <input
                            type="text"
                            value={data.country || ''}
                            onChange={(e) => onChange('country', e.target.value)}
                            disabled={!isEditing}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Linkedin size={16} />
                            LinkedIn URL
                        </label>
                        <input
                            type="url"
                            value={data.linkedInUrl || ''}
                            onChange={(e) => onChange('linkedInUrl', e.target.value)}
                            disabled={!isEditing}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                </div>
            </div>

            {/* Professional Information */}
            <div className={`${THEME_CLASSES.cards} p-8 shadow-lg`}>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Building2 size={16} />
                            Current Company
                        </label>
                        <input
                            type="text"
                            value={data.currentCompany || ''}
                            onChange={(e) => onChange('currentCompany', e.target.value)}
                            disabled={!isEditing}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Total Experience (years)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={data.overallExperience || ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                onChange('overallExperience', v === '' ? '' : parseFloat(v));
                            }}
                            disabled={!isEditing}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <DollarSign size={16} />
                            Expected Salary
                        </label>
                        <input
                            type="text"
                            value={typeof data.expectedSalary === 'object' ? data.expectedSalary.min || '' : data.expectedSalary || ''}
                            onChange={(e) => onChange('expectedSalary', e.target.value)}
                            disabled={!isEditing}
                            placeholder="e.g., 80000"
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                            <Clock size={16} />
                            Notice Period (days)
                        </label>
                        <input
                            type="number"
                            value={data.noticePeriod ?? ''}
                            onChange={(e) => {
                                const v = e.target.value;
                                onChange('noticePeriod', v === '' ? '' : parseInt(v, 10));
                            }}
                            disabled={!isEditing}
                            className={THEME_CLASSES.inputs}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Summary</label>
                    <textarea
                        value={data.experienceSummary || ''}
                        onChange={(e) => onChange('experienceSummary', e.target.value)}
                        disabled={!isEditing}
                        rows={4}
                        className={THEME_CLASSES.inputs}
                    />
                </div>
            </div>
        </div>
    );
};
