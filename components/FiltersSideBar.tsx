import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Slider,
  Select,
  Checkbox,
  CheckboxChangeEvent,
} from "antd";
import { Filters } from "@/types/filters";
import { MealType } from "../types/mealType";
import { Cuisine } from "@/types/cuisine";

const { Option } = Select;

const FiltersSideBar = ({
  applyFilters,
  mealTypes,
  cuisines,
}: {
  applyFilters: (sidebarFilters: Filters) => void;
  mealTypes: MealType[];
  cuisines: Cuisine[];
}) => {
  const [filters, setFilters] = useState<Filters>({
    area: "",
  });
  const [changed, setChanged] = useState(false);
  const [cost, setCost] = useState([0, 10000]);

  const updateItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "discount") {
      if (parseInt(value) > 100) {
        return;
      }
    }
    setFilters((f) => {
      return { ...f, [name]: value };
    });
  };

  useEffect(() => {
    setFilters((f) => {
      return { ...f, minCost: cost[0], maxCost: cost[1] };
    });
  }, [cost]);

  return (
    <div
      className="w-100 overflow-auto p-6 rounded-md h-[80svh] flex flex-col sticky top-28 shadow-md"
      style={{ backgroundColor: "#f2eed3" }}
    >
      <div className="">
        <p className="text-lg font-poppins border-b border-black/20 pb-2">
          Filters
        </p>

        <div className="flex flex-col mt-6">
          <Form layout="vertical">
            {/* Area */}
            <Form.Item label="Area" name="area">
              <Input
                placeholder="Enter area"
                className="bg-transparent border-black/30"
                value={filters.area}
                onChange={updateItems}
                name="area"
              />
            </Form.Item>

            {/* Cost Range */}
            <Form.Item label={`Cost Range (${cost[0]} - ${cost[1]})`}>
              <Slider
                range
                min={0}
                max={10000}
                value={cost}
                step={100}
                onChange={setCost}
              />
            </Form.Item>

            {/* Discount */}
            <Form.Item label="Minimum Discount (%)" name="discount">
              <Input
                type="number"
                min={0}
                max={100}
                className="bg-transparent border-black/30"
                value={filters.discount}
                name="discount"
                onChange={updateItems}
              />
            </Form.Item>

            {/* Cuisines */}
            <Form.Item label="Cuisines" name="cuisineIds">
              <Select
                mode="multiple"
                placeholder="Select cuisines"
                className="bg-transparent"
                value={filters.cuisineIds || []}
                maxCount={5}
                onChange={(e: string[]) => {
                  setFilters((f) => {
                    return { ...f, cuisineIds: e };
                  });
                }}
              >
                {cuisines.map((e) => {
                  return (
                    <Option value={e.id} key={e.id}>
                      {e.cuisine_name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            {/* Meal Types */}
            <Form.Item label="Meal Types" name="mealTypes">
              <Select
                mode="multiple"
                placeholder="Select Meal Type"
                className="bg-transparent"
                maxCount={5}
                value={filters.mealtypeIds || []}
                onChange={(e: string[]) => {
                  setFilters((f) => {
                    return { ...f, mealtypeIds: e };
                  });
                }}
              >
                {mealTypes.map((e) => {
                  return (
                    <Option value={e.id} key={e.id}>
                      {e.meal_type}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>

            {/* Free */}
            <Form.Item name="free" valuePropName="checked">
              <Checkbox
                value={filters.free || false}
                onChange={(e: CheckboxChangeEvent) => {
                  setFilters((f) => {
                    return { ...f, free: e.target.checked };
                  });
                }}
                className="text-black"
              >
                Free
              </Checkbox>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div
        onClick={() => {
          applyFilters(filters);
        }}
        className="w-full flex justify-end"
      >
        <button className="w-fit cursor-pointer text-right bg-primary text-background px-6 py-3 rounded-md">
          Apply
        </button>
      </div>
    </div>
  );
};

export default FiltersSideBar;
