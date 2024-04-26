import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const RadioSeries = ({ options }) => {
  const [selectedProductType, setselectedProductType] = useState(options[0]);
  const [value, setValue] = useState(new Date());

  return (
    <div className='border-gray-200'>
      <RadioGroup value={selectedProductType} onChange={setselectedProductType}>
        <div className='mt-4 grid grid-cols-3 w-full px-[5%] sm:grid-cols-3 sm:gap-x-2 sm:w-full'>
          {options.map(option =>
            option.field_type === 'field' ? (
              <div class='w-full md:w-full px-3 '>
                <input
                  class='border-1 rounded-lg px-2 w-full bg-gray-200 text-gray-700 bg-white border border-gray-300 mt-[0%] py-[8.92%] rounded eading-tight focus:outline-none focus:border-gray-500'
                  id='grid-first-name'
                  type='text'
                  placeholder='Expiry'
                />
              </div>
            ) : option.field_type === 'date' ? (
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label='Expiry Date'
                    onChange={val => setValue(val)}
                  />
                </LocalizationProvider>
              </div>
            ) : (
              <div className='w-[90%]'>
                <RadioGroup.Option
                  key={option.id}
                  value={option}
                  className={({ checked, active }) =>
                    classNames(
                      checked ? 'border-transparent' : 'border-gray-300',
                      active ? 'ring-2 ring-indigo-500' : '',
                      'relative flex cursor-pointer rounded border bg-white p-4 shadow-sm focus:outline-none',
                    )
                  }
                >
                  {({ checked, active }) => (
                    <>
                      <span className='flex flex-1'>
                        <span className='flex flex-col py-[1%]'>
                          <RadioGroup.Label
                            as='span'
                            className='block text-sm font-medium text-gray-900'
                          >
                            {option.name}
                          </RadioGroup.Label>
                        </span>
                      </span>
                      {checked ? (
                        <CheckCircleIcon
                          className='h-5 w-5 text-indigo-600'
                          aria-hidden='true'
                        />
                      ) : null}
                      <span
                        className={classNames(
                          active ? 'border' : 'border-2',
                          checked ? 'border-indigo-500' : 'border-transparent',
                          'pointer-events-none absolute -inset-px rounded-lg',
                        )}
                        aria-hidden='true'
                      />
                    </>
                  )}
                </RadioGroup.Option>
              </div>
            ),
          )}
        </div>
      </RadioGroup>
    </div>
  );
};

export default RadioSeries;
