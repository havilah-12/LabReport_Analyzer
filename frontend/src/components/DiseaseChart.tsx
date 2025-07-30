import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";

// Soft pastel/vibrant colors
const COLORS: string[] = [
  "#60a5fa", // blue-400
  "#f87171", // red-400
  "#fbbf24", // yellow-400
  "#34d399", // green-400
  "#a78bfa", // purple-400
  "#f472b6", // pink-400
  "#22d3ee", // cyan-400
];

interface Disease {
  disease: string;
  patients: number;
  color: string;
}

const DiseaseChart = () => {
  const [diseaseData, setDiseaseData] = useState<Disease[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/disease-distribution")
      .then((res) => res.json())
      .then((data) => {
        const coloredData = data.map((d: any, i: number) => ({
          ...d,
          color: COLORS[i % COLORS.length],
        }));
        setDiseaseData(coloredData);
      });
  }, []);

  const totalPatients = diseaseData.reduce((sum, d) => sum + d.patients, 0);

  return (
    <div className="space-y-8">
      {/* 📊 Overview Card */}
      <Card className="shadow-lg border-none rounded-2xl bg-gradient-to-r from-white to-blue-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-3 text-2xl font-semibold text-blue-700">
            <div className="p-2 rounded-full bg-blue-100">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <span>Disease Distribution Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">
                {totalPatients}
              </p>
              <p className="text-sm text-gray-500">Total Patients</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-500">
                {diseaseData.length}
              </p>
              <p className="text-sm text-gray-500">Disease Types</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {Math.max(...diseaseData.map((d) => d.patients))}
              </p>
              <p className="text-sm text-gray-500">Highest Count</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">
                {Math.round(totalPatients / diseaseData.length || 0)}
              </p>
              <p className="text-sm text-gray-500">Avg. per Disease</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🥧 Pie Chart Card */}
      <Card className="shadow-lg border-none rounded-2xl bg-gradient-to-br from-white to-pink-50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-3 text-2xl font-semibold text-pink-700">
            <div className="p-2 rounded-full bg-pink-100">
              <Activity className="h-5 w-5 text-pink-600" />
            </div>
            <span>Disease Distribution Chart</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={diseaseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                dataKey="patients"
              >
                {diseaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#333",
                }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiseaseChart;
