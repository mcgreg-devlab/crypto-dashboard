"use client";

import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from "recharts";

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

interface ChartPoint {
  actualPrice: number;
  normalizedValue: number;
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
        <p className="text-xs font-medium text-gray-500">
          Historical Price
        </p>

        <p className="text-base font-bold text-gray-900">
          $
          {payload[0].payload.actualPrice.toLocaleString(
            undefined,
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </p>
      </div>
    );
  }

  return null;
}

export default function Home() {
  const [prices, setPrices] = useState<CryptoData | null>(null);

  const [bitcoinChart, setBitcoinChart] = useState<ChartPoint[]>([]);
  const [ethereumChart, setEthereumChart] = useState<ChartPoint[]>([]);
  const [solanaChart, setSolanaChart] = useState<ChartPoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");

  const normalizeChart = (prices: number[]) => {
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return prices.map((price) => ({
      actualPrice: price,
      normalizedValue:
        ((price - min) / (max - min || 1)) * 100,
    }));
  };

  const fetchPrices = async () => {
    try {
      setLoading(true);

      // LIVE PRICES
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true"
      );

      const data = await response.json();

      setPrices(data);

      // BITCOIN
      const bitcoinResponse = await fetch(
        "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7"
      );

      const bitcoinData = await bitcoinResponse.json();

      setBitcoinChart(
        normalizeChart(
          bitcoinData.prices.map(
            (price: number[]) => price[1]
          )
        )
      );

      // ETHEREUM
      const ethereumResponse = await fetch(
        "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7"
      );

      const ethereumData = await ethereumResponse.json();

      setEthereumChart(
        normalizeChart(
          ethereumData.prices.map(
            (price: number[]) => price[1]
          )
        )
      );

      // SOLANA
      const solanaResponse = await fetch(
        "https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=7"
      );

      const solanaData = await solanaResponse.json();

      setSolanaChart(
        normalizeChart(
          solanaData.prices.map(
            (price: number[]) => price[1]
          )
        )
      );

      setLastUpdated(
        new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      );
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const getChangeColor = (change: number) => {
    return change >= 0
      ? "text-green-600"
      : "text-red-600";
  };

  const formatChange = (change: number) => {
    return `${change >= 0 ? "+" : ""}${change.toFixed(
      2
    )}%`;
  };

  const CustomTooltip = ({
    active,
    payload,
  }: any) => {
    if (
      active &&
      payload &&
      payload.length
    ) {
      return (
        <div className="rounded-lg border bg-white p-3 shadow-lg">
          <p className="font-semibold">
            $
            {payload[0].payload.actualPrice.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
              }
            )}
          </p>
        </div>
      );
    }

    return null;
  };

  const CryptoCard = ({
    name,
    symbol,
    price,
    change,
    chartData,
    color,
  }: any) => (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <h2
        className="text-xl font-bold"
        style={{ color }}
      >
        {symbol} {name}
      </h2>

      <p className="mt-4 text-4xl font-bold text-gray-900">
        ${price.toLocaleString()}
      </p>

      <p
        className={`mt-3 text-lg font-semibold ${getChangeColor(
          change
        )}`}
      >
        {formatChange(change)}
      </p>

      <div className="mt-6 h-32">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={chartData}>
            <Tooltip
  cursor={{ stroke: "#94a3b8", strokeWidth: 1 }}
  contentStyle={{
    backgroundColor: "#111827",
    border: "none",
    borderRadius: "10px",
    color: "#ffffff",
    fontWeight: "bold",
  }}
  formatter={(value: any, name: any, props: any) => [
    `$${props.payload.actualPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    "Price",
  ]}
/>

            <Line
              type="monotone"
              dataKey="normalizedValue"
              stroke={color}
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-2 text-xs text-gray-400">
        Last 7 Days
      </p>
    </div>
  );

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
            <p className="text-lg">
              Loading crypto prices...
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            <CryptoCard
              name="Bitcoin"
              symbol="₿"
              price={prices!.bitcoin.usd}
              change={
                prices!.bitcoin.usd_24h_change
              }
              chartData={bitcoinChart}
              color="#f97316"
            />

            <CryptoCard
              name="Ethereum"
              symbol="⟠"
              price={prices!.ethereum.usd}
              change={
                prices!.ethereum.usd_24h_change
              }
              chartData={ethereumChart}
              color="#3b82f6"
            />

            <CryptoCard
              name="Solana"
              symbol="◎"
              price={prices!.solana.usd}
              change={
                prices!.solana.usd_24h_change
              }
              chartData={solanaChart}
              color="#22c55e"
            />
          </div>
        )}

        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            About This Dashboard
          </h2>

          <p className="text-gray-700">
            This dashboard fetches live cryptocurrency prices and real
            7-day historical market data from the CoinGecko API.
            Built with Next.js, TypeScript, Tailwind CSS, and Recharts.
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