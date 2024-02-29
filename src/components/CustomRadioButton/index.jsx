const CustomRadio = ({ id, name, value, label, checked, onChange }) => {
    console.log(checked)
  return (
    <label htmlFor={id} className="inline-flex items-center cursor-pointer">
      <input
        id={id}
        type="radio"
        className="hidden"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <div className={ `mb-3 text-sm px-3 lightGrayBg leading-8 rounded-xl flexCenter gap-1 w-24 ${checked && 'bg-white border border-lightGray-100'}`}>
        {<span>{label}</span>}
      </div>
      
    </label>
  );
};

export default CustomRadio;
