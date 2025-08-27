
'use client';

import { AgeCalculator, BmiCalculator } from '@/components/tools/utility-calculators';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UtilityCalculatorsPage({ params }: { params: { tool: string } }) {
    const pathname = usePathname();

    const getToolFromPath = () => {
        if (pathname.includes('age-calculator')) return 'age-calculator';
        if (pathname.includes('bmi-calculator')) return 'bmi-calculator';
        return 'age-calculator';
    }

    return (
        <Tabs defaultValue={getToolFromPath()} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="age-calculator" asChild>
                    <Link href="/utility-calculators/age-calculator">Age Calculator</Link>
                </TabsTrigger>
                <TabsTrigger value="bmi-calculator" asChild>
                    <Link href="/utility-calculators/bmi-calculator">BMI Calculator</Link>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="age-calculator">
                <AgeCalculator />
            </TabsContent>
            <TabsContent value="bmi-calculator">
                <BmiCalculator />
            </TabsContent>
        </Tabs>
    );
}
