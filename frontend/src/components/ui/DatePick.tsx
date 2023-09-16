import { useState } from 'react';
import DatePicker from 'tailwind-datepicker-react';

interface DatePickProps {
  placeholder: string;
  id: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
}

const DatePick: React.FC<DatePickProps> = ({ placeholder, setSelectedDate, id }) => {
  const options = {
    autoHide: true,
    todayBtn: true,
    clearBtn: true,
    defaultDate: null,
    inputPlaceholderProp: placeholder,
    inputDateFormatProp: {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
    theme: {
      input: 'pl-10',
      inputIcon: 'absolute top-[10px]',
    },
    inputIdProp: id
  };

  const [show, setShow] = useState<boolean>(false);

  const handleChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="relative w-60">
      <DatePicker
        show={show}
        onChange={handleChange}
        setShow={(state) => setShow(state)}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={options}
        classNames="absolute"
      />
    </div>
  );
};

export default DatePick;
