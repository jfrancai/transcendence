export default function InputField(props: {
  label: string;
  type: string;
  readOnly?: boolean;
  name?: string;
  placeholder?: string;
  handleInput?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const { label, type, readOnly, name, handleInput, placeholder } = props;
  if (type === 'checkbox') {
    return (
      <div className="p-[1px]">
        <input
          type={type}
          name={name !== undefined ? name : type}
          id={label}
          className="dark:bg-bluepong-2 mr-[0.25rem] mt-2 h-4 w-4 rounded bg-blue-pong-3 text-blue-pong-1 focus:ring-2 focus:ring-blue-pong-1 dark:border-blue-pong-2 dark:ring-offset-blue-pong-3 dark:focus:ring-blue-pong-2"
        />
        <label
          className="font-roboto text-[15px] text-sm font-bold text-blue-pong-1"
          htmlFor={label}
        >
          {label}
        </label>
      </div>
    );
  }

  return (
    <div className="p-[1px]">
      <label
        className="font-roboto text-[15px] text-sm font-bold text-blue-pong-1"
        htmlFor={label}
      >
        {label}
      </label>
      <input
        readOnly={readOnly}
        disabled={readOnly}
        type={type}
        name={name !== undefined ? name : type}
        id={label}
        onKeyDown={handleInput}
        placeholder={placeholder}
        className="h-[50px] w-full rounded-[15px] bg-blue-pong-3 p-2 text-white"
        style={{ boxShadow: 'inset 0 0 7px rgba(0,0,0,0.4)' }}
      />
    </div>
  );
}
