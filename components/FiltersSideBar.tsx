import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Slider,
  Select,
  Checkbox,
  CheckboxChangeEvent,
  ConfigProvider,
} from "antd";
import { MealType } from "../types/mealType";
import { Cuisine } from "@/types/cuisine";
import { AllFilters } from "@/types/filters";
import { RefreshCcw } from "lucide-react";
import { useRef } from "react";

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
  const [form] = Form.useForm();
  const [cost, setCost] = useState([
    filters.minCost || 0,
    filters.maxCost || 10000,
  ]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --------------- Handle Change ---------------

  const updateItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Prevent user from exceeding 100
    if (name === "discount") {
      if (parseInt(value) > 100) {
        setFilters((f) => {
          return { ...f, discount: 100 };
        });
      }
    }

    setFilters((f) => {
      return { ...f, [name]: value };
    });
  };

  // -------------- Debounce filter update on cost param --------------
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setFilters((f) => {
        if (f.minCost === cost[0] && f.maxCost === cost[1]) {
          return f;
        }
        return { ...f, minCost: cost[0], maxCost: cost[1] };
      });
    }, 500);
  }, [cost]);

  // --------- Update fields from updated filters ------------
  useEffect(() => {
    form.setFieldsValue(filters);
  }, [filters]);

  return (
    <div
      data-testid="filter-sidebar"
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
          <ConfigProvider
            theme={{
              components: {
                Input: {
                  paddingBlock: 8, // vertical padding
                  paddingInline: 16, // horizontal padding
                },
                InputNumber: {
                  paddingBlock: 8,
                  paddingInline: 16,
                },
                Select: {
                  controlHeight: 48,
                },
                Form: {
                  itemMarginBottom: 10,
                },
              },
              token: {
                colorPrimary: "#8b1e3f",
              },
            }}
          >
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
              <Form.Item label="Rating">
                <Slider
                  min={1}
                  value={filters.rating}
                  step={1}
                  max={5}
                  onChange={(e: number) => {
                    setFilters((f) => {
                      return { ...f, rating: e };
                    });
                  }}
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
                  placeholder="Discount eg:(40)"
                />
              </Form.Item>

              {/* Cuisines */}
              <Form.Item label="Cuisines" name="cuisineIds">
                <Select
                  mode="multiple"
                  placeholder="Select cuisines"
                  className="bg-transparent capitalize"
                  value={filters.cuisineIds || []}
                  maxCount={5}
                  onChange={(e: string[]) => {
                    setFilters((f) => {
                      return { ...f, cuisineIds: e };
                    });
                  }}
                >
                  {cuisines.map((e) => {
                    const [firstLetter, ...restChars] = e.cuisine_name;
                    return (
                      <Option value={`${e.cuisine_name}-${e.id}`} key={e.id}>
                        {firstLetter.toUpperCase()}
                        {...restChars}
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
                    const [firstletter, ...restChars] = e.meal_type;
                    return (
                      <Option value={`${e.meal_type}-${e.id}`} key={e.id}>
                        {firstletter.toUpperCase()}
                        {...restChars}
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
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default FiltersSideBar;
