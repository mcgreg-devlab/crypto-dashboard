"use client";

import { useEffect, useState } from "react";

interface CryptoData {
  bitcoin: {
    usd: number;
    usd_24h_change: number;
  };
  ethereum: {
    usd: number;
    usd_24h_change: number;
  };
  solana: {
    usd: number;
    usd_24h_change: number;
  };
}

export default function Home() {
  const [prices, setPrices] = useState<CryptoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const fetchPrices = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"
      );

      const data = await response.json();

      setPrices(data);

      setLastUpdated(
        new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      );
    } catch (error) {
      console.error("Error fetching prices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const formatChange = (change: number) => {
    return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          MCGREG DEVLAB • PROJECT #002
        </p>

        <h1 className="mb-3 text-5xl font-bold text-gray-900">
          Crypto Market Dashboard
        </h1>

        <div className="mb-4 inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
          🟢 Live Market Data
        </div>

        <p className="mb-6 text-lg text-gray-600">
          Live cryptocurrency prices powered by CoinGecko.
        </p>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            onClick={fetchPrices}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-lg"
          >
            Refresh Prices
          </button>

          {lastUpdated && (
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Last Updated
              </p>

              <p className="text-sm text-gray-700">
                {lastUpdated}
              </p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-10 shadow">
            <p className="text-lg">Loading crypto prices...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Bitcoin */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h2 className="text-xl font-bold text-orange-500">
                ₿ Bitcoin
              </h2>

              <p className="mt-4 text-4xl font-bold text-gray-900">
                ${prices?.bitcoin.usd.toLocaleString()}
              </p>

              <p
                className={`mt-3 text-lg font-semibold ${getChangeColor(
                  prices?.bitcoin.usd_24h_change ?? 0
                )}`}
              >
                {formatChange(
                  prices?.bitcoin.usd_24h_change ?? 0
                )}
              </p>
            </div>

            {/* Ethereum */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h2 className="text-xl font-bold text-blue-500">
                ⟠ Ethereum
              </h2>

              <p className="mt-4 text-4xl font-bold text-gray-900">
                ${prices?.ethereum.usd.toLocaleString()}
              </p>

              <p
                className={`mt-3 text-lg font-semibold ${getChangeColor(
                  prices?.ethereum.usd_24h_change ?? 0
                )}`}
              >
                {formatChange(
                  prices?.ethereum.usd_24h_change ?? 0
                )}
              </p>
            </div>

            {/* Solana */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h2 className="text-xl font-bold text-green-500">
                ◎ Solana
              </h2>

              <p className="mt-4 text-4xl font-bold text-gray-900">
                ${prices?.solana.usd.toLocaleString()}
              </p>

              <p
                className={`mt-3 text-lg font-semibold ${getChangeColor(
                  prices?.solana.usd_24h_change ?? 0
                )}`}
              >
                {formatChange(
                  prices?.solana.usd_24h_change ?? 0
                )}
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            About This Dashboard
          </h2>

          <p className="text-gray-700">
            This dashboard fetches live cryptocurrency prices and
            24-hour market performance from the CoinGecko API. Built
            with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </div>

        <footer className="mt-16 border-t pt-6 text-center text-sm text-gray-500">
          <p>Built by MCGREG DEVLAB</p>
          <p>Powered by CoinGecko API</p>
        </footer>
      </div>
    </main>
  );
}