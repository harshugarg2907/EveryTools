
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse, isValid } from "date-fns";

export const AgeCalculator = () => {
    const [date, setDate] = useState<Date | undefined>();
    const [inputValue, setInputValue] = useState("");
    const [age, setAge] = useState<{ years: number, months: number, days: number } | null>(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleDateSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            setInputValue(format(selectedDate, "yyyy-MM-dd"));
        } else {
            setInputValue("");
        }
        setIsPopoverOpen(false);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        const parsedDate = parse(value, "yyyy-MM-dd", new Date());
        if (isValid(parsedDate)) {
            setDate(parsedDate);
        } else {
            setDate(undefined);
        }
    };


    const calculateAge = () => {
        if (!date) return;
        const today = new Date();
        let years = today.getFullYear() - date.getFullYear();
        let months = today.getMonth() - date.getMonth();
        let days = today.getDate() - date.getDate();

        if (days < 0) {
            months -= 1;
            const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            days += lastMonth.getDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }
        setAge({ years, months, days });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Age Calculator</CardTitle>
                <CardDescription>Calculate your age based on your date of birth.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="flex gap-2">
                         <Input
                            type="text"
                            id="dob"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="YYYY-MM-DD"
                          />
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                               <Button variant="outline" size="icon">
                                    <CalendarIcon className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={handleDateSelect}
                                    captionLayout="dropdown-buttons"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                {age && (
                    <div className="p-4 bg-secondary rounded-lg text-center">
                        <p className="text-lg text-muted-foreground">You are</p>
                        <div className="flex justify-center items-baseline gap-x-2 flex-wrap">
                           <span className="text-4xl font-bold text-primary">{age.years}</span><span className="text-lg mr-2">years</span>
                           <span className="text-4xl font-bold text-primary">{age.months}</span><span className="text-lg mr-2">months</span>
                           <span className="text-4xl font-bold text-primary">{age.days}</span><span className="text-lg">days old</span>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={calculateAge} disabled={!date}>Calculate Age</Button>
            </CardFooter>
        </Card>
    );
};

export const BmiCalculator = () => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [bmi, setBmi] = useState<{ value: number, category: string } | null>(null);

    const calculateBmi = () => {
        const h = parseFloat(height);
        const w = parseFloat(weight);
        if (h > 0 && w > 0) {
            const bmiValue = w / ((h / 100) * (h / 100));
            let category = '';
            if (bmiValue < 18.5) category = "Underweight";
            else if (bmiValue < 25) category = "Normal weight";
            else if (bmiValue < 30) category = "Overweight";
            else category = "Obesity";
            setBmi({ value: parseFloat(bmiValue.toFixed(2)), category });
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>BMI Calculator</CardTitle>
                <CardDescription>Calculate your Body Mass Index (BMI).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g., 70" />
                </div>
                <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g., 175" />
                </div>
                 {bmi && (
                    <div className="p-4 bg-secondary rounded-lg text-center">
                        <p className="text-lg">Your BMI is</p>
                        <p className="text-3xl font-bold text-primary">{bmi.value}</p>
                        <p className="text-lg font-semibold">{bmi.category}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button onClick={calculateBmi} disabled={!height || !weight}>Calculate BMI</Button>
            </CardFooter>
        </Card>
    );
};
