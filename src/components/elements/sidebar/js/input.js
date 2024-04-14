import "../css/sidebar.css";

const Input = ({ onChange, value, title, name, color, checked }) => {
  return (
    <label htmlFor={name} className="sidebar-label-container"> 
      <input
        className="mr-2"
        type="radio"
        value={value}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className="" style={{ backgroundColor: color }}></span>
      {title}
    </label>
  );
};

export default Input;
