"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { PasswordInput } from "./ui/PasswordInput";

interface PasswordGeneratorProps {
  className?: string;
}

const PasswordGenerator: React.FC<PasswordGeneratorProps> = ({ className }) => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const generatePassword = () => {
    let charset = "";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+{}:\"<>?|[];',./`~";

    // Ensure at least one character type is selected
    if (charset === "") {
      setIncludeLowercase(true);
      charset = "abcdefghijklmnopqrstuvwxyz";
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
  };

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length contribution (up to 4 points)
    strength += Math.min(4, Math.floor(password.length / 5));

    // Character variety contribution
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    // Normalize to a 0-100 scale
    setPasswordStrength(Math.min(100, Math.floor((strength / 8) * 100)));
  }, [password]);

  // Generate password only on client-side to avoid hydration errors
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStrengthLabel = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Password Generator
        </h2>
        <p className="text-muted-foreground">
          Create strong, secure passwords instantly.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="generated-password"
            className="text-sm font-medium mb-2 block"
          >
            Generated Password
          </label>
          {isClient ? (
            <PasswordInput
              id="generated-password"
              value={password}
              readOnly
              onChange={(e) => setPassword(e.target.value)}
            />
          ) : (
            <div className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 flex items-center">
              Loading...
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="password-length"
            className="text-sm font-medium mb-2 block"
          >
            Password Length: {length}
          </label>
          <input
            id="password-length"
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-blue-50 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs mt-1">
            <span>8</span>
            <span>32</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Include Characters:</p>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={() => setIncludeUppercase(!includeUppercase)}
                className="h-4 w-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={() => setIncludeLowercase(!includeLowercase)}
                className="h-4 w-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Lowercase (a-z)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={() => setIncludeNumbers(!includeNumbers)}
                className="h-4 w-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Numbers (0-9)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={() => setIncludeSymbols(!includeSymbols)}
                className="h-4 w-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Symbols (!@#$%)</span>
            </label>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">
            Password Strength:{" "}
            {isClient ? getStrengthLabel() : "Calculating..."}
          </p>
          <div className="w-full h-2 bg-blue-50 rounded-full overflow-hidden">
            {isClient && (
              <div
                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                style={{ width: `${passwordStrength}%` }}
              ></div>
            )}
          </div>
        </div>

        <Button
          onClick={generatePassword}
          className="w-full bg-indigo-500"
          disabled={!isClient}
        >
          Generate New Password
        </Button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
