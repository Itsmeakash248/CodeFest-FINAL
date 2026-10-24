import React from 'react';
import { OnboardingWizard } from '@/components/OnboardingWizard';

export const metadata = {
  title: 'Setup Your Practice Interview — ViewPilot',
  description: 'Customize your interview role, seniority, focus area, and difficulty level.',
};

export default function SetupPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <OnboardingWizard />
    </div>
  );
}
