"use client";
"use client";
import { useEffect, useState } from "react";
import { BiErrorAlt, BiSearch } from "react-icons/bi";
import { CgAdd } from "react-icons/cg";
import { BiError } from "react-icons/bi";
import { CustomTable, InventoryInputForm } from "@/components";
import { Area, Grade } from "@prisma/client";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { createPortal } from "react-dom";
import {
  categoryFormData,
  customTableDataType,
  inventoryDataType,
} from "@/types";

const Inventory = () => {
  const [inventoryData, setInventoryData] = useState<inventoryDataType[]>([]);
  const [tableData, setTableData] = useState<customTableDataType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [swalShown, setSwalShown] = useState(false);
  const [selectedUpdateData, setSelectedUpdateData] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState({
    dateFilter: "",
    areaFilter: "",
    gradeFilter: "",
  });
  const [area, setArea] = useState<Area[]>([]);
  const [grade, setGrade] = useState<Grade[]>([]);
  const [dates, setDates] = useState<{ harvestDate: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/inventory/inventory");
      const { data, area, date, grade } = await response.json();
      setInventoryData(data);
      setIsLoading(false);
      setArea(area);
      setGrade(grade);
      setDates(date);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setTableData(getDefaultData());
  }, [inventoryData]);

  useEffect(() => {
    filterTable();
  }, [filter]);

  const headers = [
    "Harvest Date",
    "Area",
    "Grade",
    "Quantity",
    "Washed",
    "Actions",
  ];

  function getDefaultData() {
    return inventoryData.reduce((acc, data) => {
      acc[data.id] = [
        String(data.harvestDate),
        data.areaName,
        data.gradeName,
        String(data.quantity),
        data.isWashed ? "True" : "False",
        data.gradeName == "Ungraded" ? "update delete" : "delete",
      ];
      return acc;
    }, {} as customTableDataType);
  }

  const filterTable = () => {
    const defaultTableData = getDefaultData();
    const newTableData = Object.keys(defaultTableData).filter((key) => {
      return (
        (filter.areaFilter === "" ||
          defaultTableData[Number(key)][1] === filter.areaFilter) &&
        (filter.gradeFilter === "" ||
          defaultTableData[Number(key)][2] === filter.gradeFilter) &&
        (filter.dateFilter === "" ||
          defaultTableData[Number(key)][0] === filter.dateFilter)
      );
    });

    const filteredData = newTableData.reduce((acc, key) => {
      acc[Number(key)] = defaultTableData[Number(key)];
      return acc;
    }, {} as customTableDataType);

    setTableData(filteredData);
  };

  const swal = withReactContent(Swal);

  const handleUpdate = (index: number) => {
    swal.fire({
      didOpen: () => setSwalShown(true),
      didClose: () => setSwalShown(false),
      showConfirmButton: false,
      customClass: {
        popup: "m-0 flex !w-auto !rounded !p-0",
        htmlContainer: "!m-0 !rounded p-0",
      },
    });

    setSelectedIndex(index);
  };

  return (
    <div className="h-full w-full bg-white text-black">
      {swalShown &&
        createPortal(
          <InventoryModal
            inventoryData={tableData[selectedIndex]}
            swal={swal}
            setSwalShown={setSwalShown}
            grade={grade}
            inventoryId={selectedIndex}
          />,
          swal.getHtmlContainer()!
        )}
      <div className="bg-accent-gray py-2 px-3 flex gap-2">
        <div className="flex gap-3">
          <label>Sort by:</label>
          <select name="sort-select" id="">
            <option value="select sort" disabled>
              Select Sort
            </option>
          </select>
        </div>
        <div className="flex gap-3">
          <label>Filters:</label>
          <select
            className="w min-w-[150px]"
            defaultValue=""
            onChange={(e) => {
              setFilter({ ...filter, dateFilter: e.target.value });
            }}
          >
            <option value="">Date</option>

            {dates.map((date, ind) => (
              <option key={ind} value={date.harvestDate}>
                {date.harvestDate}
              </option>
            ))}
          </select>
          <select
            className="w min-w-[150px]"
            defaultValue=""
            onChange={(e) => {
              setFilter({
                ...filter,
                gradeFilter: e.target.value,
              });
            }}
          >
            <option value="">Grade</option>
            {grade.map((g, ind) => (
              <option key={ind} value={g.description}>
                {g.description}
              </option>
            ))}
          </select>
          <select
            className="w min-w-[150px]"
            onChange={(e) => {
              setFilter({
                ...filter,
                areaFilter: e.target.value,
              });
            }}
          >
            <option value="">Area</option>
            {area.map((area, ind) => (
              <option key={ind} value={area.description}>
                {area.description}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 flex justify-end items-center ">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            className="rounded-lg placeholder:pl-2"
          />
          <BiSearch className="-ml-[1.25em] text-primary-color" />
        </div>
      </div>

      <div className="flex flex-col p-3 bg-white">
        <CustomTable
          headers={headers}
          data={tableData}
          isLoading={isLoading}
          handleUpdate={handleUpdate}
        />
      </div>
    </div>
  );
};
export default Inventory;

const InventoryModal = ({
  inventoryData,
  swal,
  grade,
  setSwalShown,
  inventoryId,
}: {
  inventoryData: string[];
  swal: typeof Swal;
  grade: Grade[];
  setSwalShown: (val: boolean) => void;
  inventoryId?: number;
}) => {
  const [categoryFormData, setCategoryFormData] = useState<categoryFormData[]>(
    []
  );
  const [ungradedQuantity, setUngradedQuantity] = useState(
    Number(inventoryData[3])
  );
  const [isQuantityError, setIsQuantityError] = useState(false);
  const [isError, setIsError] = useState(false);

  const createInventoryForm = () => {
    const newData: categoryFormData = {
      grade: grade[0].id,
      quantity: 0,
      isWashed: false,
    };
    setCategoryFormData([...categoryFormData, newData]);
  };

  useEffect(() => {
    computeUngradedQuantity();
  }, [categoryFormData]);

  const handleInventoryFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const newCategoryFormData = [...categoryFormData];
    const field = e.target.name;
    console.log(e.target.name);
    if (e.target.name === "isWashed") {
      newCategoryFormData[index][field] = !newCategoryFormData[index][field];
    } else {
      newCategoryFormData[index][field] = Number(e.target.value);
      setCategoryFormData(newCategoryFormData);
    }
  };

  const handleRemoveForm = (index: number) => {
    const newCategoryFormData = [...categoryFormData];
    newCategoryFormData.splice(index, 1);
    setCategoryFormData(newCategoryFormData);
  };

  const computeUngradedQuantity = () => {
    let sortedQuantity = 0;
    categoryFormData.map((data) => {
      sortedQuantity += Number(data.quantity);
    });
    const ungradedQuantity = Number(inventoryData[3]) - sortedQuantity;
    setUngradedQuantity(ungradedQuantity);
    if (ungradedQuantity < 0) {
      setIsQuantityError(true);
    } else {
      setIsQuantityError(false);
      setIsError(false);
    }
  };

  const saveForm = async () => {
    if (isQuantityError) {
      setIsError(true);
    } else {
      const response = await fetch("/api/inventory/inventory", {
        method: "POST",
        body: JSON.stringify({
          categoryFormData: categoryFormData,
          inventoryId: inventoryId,
        }),
      });
      if (response.ok) {
        swal
          .fire({
            title: "Success",
            icon: "success",
            text: "Inventory Saved",
          })
          .then(() => {
            location.reload();
          });
      } else {
        swal.fire({
          title: "error",
        });
      }
      setSwalShown(false);
    }
  };
  return (
    <div className="flex bg-white min-w-[900px] min-h-[400px] flex-col text-black rounded">
      <div className=" bg-accent-gray flex items-center p-3">
        <b>Inventory</b>
      </div>
      <div className="px-3 flex flex-col gap-3">
        <div className="flex gap-3 items-center  py-1 text-[20px]">
          <label>Date:</label>
          <input
            type="text"
            name="date"
            className="h-[20px] py-3 px-1 border-2 border-add-minus"
            value={inventoryData[0]}
            readOnly
          />
          <label>Area</label>
          <input
            type="text"
            name="area"
            className="h-[20px] py-3 px-1 border-2 border-add-minus"
            value={inventoryData[1]}
            readOnly
          />
          <label>Quantity</label>
          <input
            type="text"
            name="quantity"
            className={`h-[20px] py-3 px-1 border-2 border-add-minus ${
              isQuantityError && "text-red-600"
            }`}
            value={ungradedQuantity}
            readOnly
          />
          <button
            className="px-3 py-2 shadow-neutral-600 border-add-minus shadow button hover:bg-neutral-500 bg-accent-gray border-[1px] rounded flex"
            onClick={() => {
              createInventoryForm();
            }}
          >
            Add New
            <CgAdd />
          </button>
        </div>
        <div className="py-2 h-[500px] overflow-y-auto flex  flex-col gap-3">
          {categoryFormData.map((data, index) => (
            <InventoryInputForm
              handleChange={handleInventoryFormChange}
              handleDelete={handleRemoveForm}
              inventoryFormData={data}
              grade={grade}
              index={index}
              key={index}
            />
          ))}
        </div>
        {isError && (
          <p className="flex justify-center items-center text-red-500">
            <BiErrorAlt className=" h-[40px] w-[40px] mr-4" /> Sorted Quantity
            does not match the ungraded quantity.
          </p>
        )}
        <div className="py-4 flex gap-3 justify-center">
          <button
            className="bg-red-500 text-white float-right min-w-[100px] rounded-full px-4 py-2"
            onClick={() => {
              swal.close();
            }}
          >
            Cancel
          </button>
          <button
            className="bg-primary-color text-white float-right min-w-[100px] rounded-full px-4 py-2"
            onClick={() => {
              saveForm();

              console.log(categoryFormData);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
