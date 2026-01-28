import React from 'react';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero Section with Login */}
            <section className="relative py-20 lg:py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        {/* Left Side - Hero Content */}
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6">
                                Modern Hiring for the <span className="text-primary-500">Digital Age</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                Skilltera connects top talent with world-class companies through an intelligent, data-driven recruitment platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/auth/login">
                                    <Button size="lg" className="w-full sm:w-auto group">
                                        Sign In <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/auth/signup">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Side - Feature Highlights */}
                        <div className="space-y-6">
                            {[
                                { icon: '🎯', title: 'Smart Matching', desc: 'AI finds the perfect candidate fit' },
                                { icon: '⚡', title: 'Fast Hiring', desc: 'Reduce time-to-hire significantly' },
                                { icon: '📊', title: 'Data Insights', desc: 'Deep analytics for better decisions' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="text-2xl">{item.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                        <p className="text-sm text-slate-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 right-10 w-72 h-72 bg-primary-100/50 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-100/50 rounded-full blur-3xl" />
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Skilltera?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Our platform combines cutting-edge technology with human expertise to deliver exceptional hiring results.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { title: 'Smart Matching', desc: 'AI-driven algorithms to find the perfect candidate fit.' },
                            { title: 'Streamlined Process', desc: 'End-to-end recruitment management from sourcing to hiring.' },
                            { title: 'Real-time Analytics', desc: 'Deep insights into your hiring pipeline and performance.' },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 mb-6">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-slate-900">{feature.title}</h3>
                                <p className="text-slate-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
