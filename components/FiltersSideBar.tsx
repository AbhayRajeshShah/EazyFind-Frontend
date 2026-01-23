import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Slider,
  Select,
  Checkbox,
  CheckboxChangeEvent,
} from "antd";
import { MealType } from "../types/mealType";
import { Cuisine } from "@/types/cuisine";
import { AllFilters } from "@/types/filters";
import { RefreshCcw } from "lucide-react";

const { Option } = Select;

const FiltersSideBar = ({
  mealTypes,
  cuisines,
  filters,
  setFilters,
  resetFilters,
}: {
  mealTypes: MealType[];
  cuisines: Cuisine[];
  filters: AllFilters;
  setFilters: React.Dispatch<React.SetStateAction<AllFilters>>;
  resetFilters: () => void;
}) => {
  const [cost, setCost] = useState([0, 10000]);

  const [form] = Form.useForm();

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

  useEffect(() => {
    form.setFieldsValue(filters);
  }, [filters]);

  return (
    <div
      className="w-100 max-w-[20rem] overflow-auto p-6 rounded-md h-[80svh] flex flex-col sticky top-28 shadow-md"
      style={{ backgroundColor: "#f2eed3" }}
    >
      <div className="">
        <div className="flex justify-between items-center w-full border-b border-black/20 pb-2">
          <p className="text-lg font-poppins ">Filters</p>
          <button
            onClick={() => {
              setCost([0, 10000]);
              resetFilters();
              form.resetFields();
            }}
            className="w-fit cursor-pointer text-right text-primary rounded-md"
          >
            <RefreshCcw className="w-5" />
          </button>
        </div>

        <div className="flex flex-col mt-6">
          <Form form={form} layout="vertical">
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
    </div>
  );
};

export default FiltersSideBar;
