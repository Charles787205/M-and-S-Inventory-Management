"use client";
import Link from "next/link";
import { DisplayID } from "@/components";
import { Chart, ArcElement } from "chart.js/auto";
import { useRef, useState } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";

export default function Dashboard() {
  Chart.register(ArcElement);
  const [sortOption, setSortOption] = useState("grade");

  const sortByGrade = () => {
    setSortOption("grade");
  };

  const sortByArea = () => {
    setSortOption("area");
  };
  const donutData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "Test",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const barData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "Test",
        data: [300, 50, 100],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const lineData = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "Test",
        data: [300, 50, 100],
        backgroundColor: ["rgb(255, 99, 132)"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="w-full h-full flex flex-col">
      <DisplayID />
      {/* Inventory Summary container */}
      <div className="w-full h-1/2 bg-accent-green rounded-3xl p-4 flex">
        <div className="w-full flex flex-col">
          <h1 className="text-[30px] text-letters-color font-black pb-4">
            Inventory Summary
          </h1>
          <div className="w-full h-full pr-4">
            <div className="w-full h-full bg-custom-white rounded-3xl p-4 flex flex-col">
              <div className="w-full h-full text-letters-color flex flex-col p-4">
                {/* TODO: By Grade/Area Regular A/B/C/D KG Pie Chart, Time series chart, and Yearly Chart */}
                <div className="flex w-full justify-evenly">
                  {/* BY GRADE/AREA HERE*/}
                  <button
                    className={
                      sortOption === "grade"
                        ? "w-[250px] h-[50px] rounded-xl bg-accent-green flex justify-center items-center"
                        : "w-[250px] h-[50px] rounded-xl bg-custom-white border-2 border-opacity-40 flex justify-center items-center"
                    }
                    onClick={sortByGrade}
                  >
                    <h1 className="font-bold text-[20px] text-letters-color">
                      By Grade
                    </h1>
                  </button>
                  <button
                    className={
                      sortOption === "area"
                        ? "w-[250px] h-[50px] rounded-xl bg-accent-green flex justify-center items-center"
                        : "w-[250px] h-[50px] rounded-xl bg-custom-white border-2 border-opacity-40 flex justify-center items-center"
                    }
                    onClick={sortByArea}
                  >
                    <h1 className="font-bold text-[20px] text-letters-color">
                      By Area
                    </h1>
                  </button>
                </div>
                <div className="w-full h-full pt-[20px]">
                  {/* REGULAR A TO D HERE */}
                  <div className="w-full justify-evenly flex">
                    <div className="rounded-xl flex flex-col w-[250px] h-[100px] bg-red-400 p-4">
                      <h1 className="text-[15px] font-bold text-letters-color">
                        Regular A
                      </h1>
                      <h1 className="text-[35px] font-bold text-letters-color self-center">
                        4000 KG
                      </h1>
                    </div>
                    <div className="rounded-xl flex flex-col w-[250px] h-[100px] bg-blue-400 p-4">
                      <h1 className="text-[15px] font-bold text-letters-color">
                        Regular B
                      </h1>
                      <h1 className="text-[35px] font-bold text-letters-color self-center">
                        4000 KG
                      </h1>
                    </div>
                  </div>
                  <div className="w-full justify-evenly flex pt-[20px]">
                    <div className="rounded-xl flex flex-col w-[250px] h-[100px] bg-red-400 p-4">
                      <h1 className="text-[15px] font-bold text-letters-color">
                        Regular C
                      </h1>
                      <h1 className="text-[35px] font-bold text-letters-color self-center">
                        4000 KG
                      </h1>
                    </div>
                    <div className="rounded-xl flex flex-col w-[250px] h-[100px] bg-blue-400 p-4">
                      <h1 className="text-[15px] font-bold text-letters-color">
                        Rejects
                      </h1>
                      <h1 className="text-[35px] font-bold text-letters-color self-center">
                        4000 KG
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly chart container */}
        <div className="w-full h-full rounded-3xl pt-4">
          <div className="w-full h-full rounded-3xl bg-custom-white">
            <div className="bg-custom-white w-full h-full rounded-3xl text-letters-color">
              {/* Pie Chart HERE */}
              <div className="w-full h-full flex justify-center items-center">
                <Doughnut data={donutData} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Seasonal and Yearly chart container */}
      <div className="w-full h-full flex">
        {/* Seasonal and Yearly chart container */}
        <div className="w-full h-1/2 flex">
          {/* Seasonal chart container */}
          <div className="w-full h-full rounded-3xl pr-4 pt-4">
            <div className="w-full h-full rounded-3xl bg-custom-white p-4">
              <h1 className="font-bold text-letters-color text-[30px]">
                Seasonal Chart
              </h1>
              <Line data={lineData} />
            </div>
          </div>
          {/* Yearly chart container */}
          <div className="w-full h-full rounded-3xl pt-4 ">
            <div className="w-full h-full rounded-3xl bg-custom-white p-4">
              <h1 className="font-bold text-letters-color text-[30px]">
                Yearly Chart
              </h1>
              <Bar data={barData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
