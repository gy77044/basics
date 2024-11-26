import {memo} from 'react';
import Select from 'react-select';
import { reactSelectType } from '../../../Utils/Const';

const ReactSelect = ({ id, labelname,name, options, placeholder = 'Select an option..', onChange, value, isMulti,filterOptions, closeMenuOnSelect = true, isUpload = false, icon, infoDetails, isRequired = false,disabled = false,error,pageSize=5,isSearchable=true,handleInputChange,isLoading,key,onFoucs,menuPlacement="auto" }: reactSelectType) => {

  return (
    <div className='main-box1 group relative'  title={value?.label}>
        {labelname && <label className={`label-box1  ${error && "label-error"} `}>{labelname} {isRequired && <span className='text-rose-400 text-lg pl-0.5'>*</span>}</label>}
        <Select
          name={name}
          className={`select-element ${error ? 'select-error' : ''}`}
          styles={{
            control: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => ({
              ...styles,
          //     display: 'inline-flex',
          //     border: 'none',
              borderColor:isDisabled?"rgb(209 213 219 / 1)" : error && 'rgb(251 113 133 / 1)',
              borderRadius: '0.25rem',
              // zIndex: 2,
              cursor: isDisabled ? 'not-allowed!important' : 'default',
              pointerEvents: isDisabled ? 'auto' : 'inherit',
              width: '100%',
              fontSize:"1.4vh !important",
              boxShadow: error && "0 0 1px rgb(251 113 133 / 1)",
              backgroundColor:isDisabled?"rgb(243 244 246 / 0.8)":'rgb(249 250 251 / 1)',
              // whiteSpace:'nowrap',
              "&>div:first-child": {
              //   // flexWrap: 'nowrap',
              //   // overflowX: 'auto',
              //   width:"150px",
              //   "::-webkit-scrollbar": {
              //     display: 'none',
              //     },
                  "&>div": {
              //     minWidth: "fit-content",
              //     marginBottom:"-5px !important",
              color: error && 'rgb(251 113 133 / 1) !important',
                }
              },
              "&:hover": {
                outline: 'none',
              },
              "& input": {
                color: error && 'rgb(251 113 133 / 1) !important',
                fontSize:'1.4vh !important'
              },
              "& input:focus": {
                // color:'red !important',
                border:'red',
                outline:'none !important'
              },
              "& svg": {
                color:error && 'rgb(251 113 133 / 1)',
                // transition: 'all .3s',
                // cursor: 'pointer',
                // width:"20px",
                // outline:"2px",
                // display:'none'
              },
              "& svg:focus": {
                color: 'red !important',
              },
              "& span": {
                backgroundColor: error && 'rgb(251 113 133 / 1)',
              }
            }),
            menu: (styles: any) => ({
              ...styles,
              fontSize:'1.4vh !important',
              // zIndex: 999,
              // position: 'absolute',
              // width: '100%',
              // padding: '0px',
              "& div::-webkit-scrollbar": {
                  width: '0.4vh',
                  height: '0.4vh'
              },
              "& div::-webkit-scrollbar-track":{
                background: '#fff'
              },
              "& div::-webkit-scrollbar-thumb":{
                borderRadius: '0.1vh',
                backgroundColor: 'transparent',
                backgroundImage: 'linear-gradient(to top, #c1c1c1 0, #c1c1c1 100%)'
              }
            }),
          }}
          filterOption={filterOptions}
          onFocus={onFoucs}
          isMulti={isMulti}
          options={options}
          onChange={onChange}
          value={value}
          isSearchable={isSearchable}
          pageSize={pageSize}
          placeholder={placeholder}
          closeMenuOnSelect={closeMenuOnSelect}
          isDisabled={disabled}
          onInputChange={(inputValue:string,inputMeta:any)=>handleInputChange && handleInputChange(inputValue,name,inputMeta)}
          isLoading={isLoading}
          key={key}
          menuPlacement={menuPlacement}
          // noOptionsMessage={(obj)=><>{labelname} Not Found</>}
        />
        {error && <span className="label-box1 label-error">{error}</span>}
      </div>
  );
};

export default memo(ReactSelect);
