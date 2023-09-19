import { useState } from 'react';
import DatePicker from 'tailwind-datepicker-react';

interface DatePickProps {
  placeholder: string;
  id: string;
  clearBtn?: boolean;
}

const DatePick: React.FC<DatePickProps> = ({ placeholder, id, clearBtn }) => {
  const options = {
    autoHide: true,
    todayBtn: true,
    clearBtn: clearBtn !== undefined ? clearBtn : true,
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
    inputIdProp: id,
  };

  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="relative w-full">
      <DatePicker
        show={show}
        setShow={(state) => setShow(state)}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={options}
      />
    </div>
  );
};

export default DatePick;
