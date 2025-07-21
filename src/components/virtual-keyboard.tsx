
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp, Delete } from "lucide-react";

interface VirtualKeyboardProps {
  language: 'de' | 'ar';
  onKeyPress: (key: string) => void;
  className?: string;
}

const deLowerCase = [
    'q', 'w', 'e', 'r', 't', 'z', 'u', 'i', 'o', 'p', 'ü',
    'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä',
    'y', 'x', 'c', 'v', 'b', 'n', 'm', 'ß',
];

const deUpperCase = [
    'Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P', 'Ü',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ö', 'Ä',
    'Y', 'X', 'C', 'V', 'B', 'N', 'M',
];

const arabicKeys = [
    'ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د',
    'ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط',
    'ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', 'ذ'
];

export function VirtualKeyboard({ language, onKeyPress, className }: VirtualKeyboardProps) {
  const [isShift, setIsShift] = useState(false);

  const handleKeyClick = (key: string) => {
    onKeyPress(key);
    if (isShift) {
      setIsShift(false);
    }
  };

  const renderGermanKeyboard = () => {
    const keys = isShift ? deUpperCase : deLowerCase;
    const layout = [keys.slice(0, 11), keys.slice(11, 22), isShift ? keys.slice(22) : keys.slice(22, 30)];
    return (
        <div className="space-y-1">
          {layout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {rowIndex === 2 && !isShift && <Button type="button" variant="outline" size="icon" className="h-10 w-12" onClick={() => setIsShift(true)}><ArrowUp className="h-4 w-4" /></Button>}
              {rowIndex === 2 && isShift && <Button type="button" variant="secondary" size="icon" className="h-10 w-12" onClick={() => setIsShift(false)}><ArrowUp className="h-4 w-4" /></Button>}
              {row.map((key) => (
                <Button key={key} type="button" variant="outline" className="h-10 w-10 text-base" onClick={() => handleKeyClick(key)}>
                  {key}
                </Button>
              ))}
              {rowIndex === 2 && <Button type="button" variant="outline" size="icon" className="h-10 w-12" onClick={() => onKeyPress('backspace')}><Delete className="h-4 w-4" /></Button>}
            </div>
          ))}
        </div>
    );
  };
  
  const renderArabicKeyboard = () => {
    const layout = [arabicKeys.slice(0, 12), arabicKeys.slice(12, 24), arabicKeys.slice(24)];
    return (
        <div className="space-y-1" dir="rtl">
            {layout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1">
                    {row.map((key) => (
                        <Button key={key} type="button" variant="outline" className="h-10 w-10 text-xl font-arabic" onClick={() => handleKeyClick(key)}>
                            {key}
                        </Button>
                    ))}
                    {rowIndex === 2 && (
                       <Button type="button" variant="outline" size="icon" className="h-10 w-12" onClick={() => onKeyPress('backspace')}><Delete className="h-4 w-4" /></Button>
                    )}
                </div>
            ))}
        </div>
    );
  };

  return (
    <div className={cn("p-2 bg-secondary/50 rounded-md", className)}>
      {language === 'de' ? renderGermanKeyboard() : renderArabicKeyboard()}
    </div>
  );
}
