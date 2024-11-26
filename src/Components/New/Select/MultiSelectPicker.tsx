import Multiselect from "multiselect-react-dropdown";
import React, { memo, useEffect, useState } from "react";
import { isTruthy } from "../../../Utils/commonFunctions";
import "./style.css";

interface Option {
  label: string;
  value: any;
  group?: string;
}

interface MultiSelectPickerProps {
  id?: string;
  groupBy?: string;
  labelname?: string;
  options: Option[];
  placeholder?: string;
  onChange: (selected: Option[]) => void;
  value: Option[] | Option;
  infoDetails?: string;
  isRequired?: boolean;
  isMulti?:boolean;
  error?:string|null
}

const MultiSelectPicker: React.FC<MultiSelectPickerProps> = ({
  id,
  groupBy,
  labelname,
  options,
  placeholder = "",
  onChange,
  value,
  isRequired = false,
  error=""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [groupedOptions, setGroupedOptions] = useState<Option[]>([]);

  useEffect(() => {
    // Inject "Select All" for each group
    const newOptions = [] as any;
    const groups = new Map<string, Option[]>();
    options.forEach((option) => {
      const group = option[(groupBy || "") as keyof object] || "" as any;
      if (!groups.has(group)) {
        groups.set(group, [{ label: `Select All ${group}`, value: `select_all_${group}`, [`${groupBy || 'group'}`]:group || 'all' }]);
      }
      groups.get(group)?.push(option);
    });

    groups.forEach((groupOptions) => {
      newOptions.push(...groupOptions);
    });

    setGroupedOptions(newOptions);
  }, [options, groupBy]);

  const handleSelect = (selectedList: Option[], selectedItem: Option) => {
    if (selectedItem.label.startsWith("Select All")) {
      // Select all options within the group
      const group = selectedItem[groupBy as keyof object];
      const groupOptions = options.filter((opt) => opt[(groupBy || "") as keyof object] === group);

      const updatedSelection = new Set(selectedList);
      groupOptions.forEach((opt) => updatedSelection.add(opt));
      
      onChange(Array.from(updatedSelection));
    } else {
      onChange(selectedList);
    }
  };

  const handleRemove = (selectedList: Option[], removedItem: Option) => {
    // Handle "Remove All" if "Select All" is deselected
    if (removedItem &&removedItem.label&&removedItem.label.startsWith("Select All")) {
      const group = removedItem[groupBy as keyof object];
      const updatedSelection = selectedList.filter(
        (opt) => opt[(groupBy || "") as keyof object] !== group
      );
      onChange(updatedSelection);
    } else {
      onChange(selectedList);
    }
  };

  const style = {
    chips: {
      background: "#069FB1",
      color: error?"#fb7185":"#ffffff",
      borderRadius: 2,
      marginBottom: 0,
      padding: "2px 7px",
    },
    searchBox: {
      overflow: "auto",
      borderColor:error && '#fb7185'
    },
    displayBlock: {
      background: "#e6e6e6",
      zIndex: 11,
    },
  };

  return (
    <div className="main-box1 group max-w-[61rem]" title={value ? Array.isArray(value) ? value.map((el: Option) => el.label).toString() : typeof value === "object" ? value?.label : value : ""}>
      {labelname && (<label className={`label-box1 ${isFocused || isTruthy(value) ? "focused" : ""} ${error && "label-error"}`}>{labelname}{" "}<span className='text-rose-400 text-lg pl-0.5'>{isRequired && '*'}</span></label>)}
      <Multiselect
        options={groupedOptions}
        selectedValues={value}
        onSelect={handleSelect}
        onRemove={handleRemove}
        onSearch={() => setIsFocused(true)}
        // onBlur={() => setIsFocused(false)}
        displayValue="label"
        groupBy={groupBy}
        showCheckbox={true}
        placeholder={placeholder}
        style={style}
        className={error ? 'select-error' : ''}
      />
        {error && <span className="label-box1 label-error">* {error}</span>}
    </div>
  );
};

export default memo(MultiSelectPicker);
