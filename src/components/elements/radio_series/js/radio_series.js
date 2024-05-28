import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { set } from 'react-hook-form';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function RadioSeries({ options, onSelectionChange }) {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [expiry, setExpiry] = useState(0);
  const [expiryState, setExpiryState] = useState(0);
  const [expiryTimeStamp, setExpiryTimeStamp] = useState(0);
  const [radioValue, setRadioValue] = useState('on-purchase');
  const [expiryMessage, setExpiryMessage] = useState('');

  useEffect(() => {
    console.log('parent rerender');
    setSelectedOption(options[0]);
    setExpiryTimeStamp(0);
    setExpiry(0);
    setExpiryState(0);
  }, [options]);

  useEffect(() => {
    if (selectedOption.option_parent !== 'rental') setExpiryState(2);
  }, [selectedOption]);

  useEffect(() => {
    onSelectionChange({
      selectedOption,
      expiry,
      expiryTimeStamp,
      expiryState,
    });
  }, [selectedOption, expiry, expiryTimeStamp, expiryState, radioValue]);

  function getTimeStampOnDate(date) {
    if (handleExpiryOnDateChange(date) === 0) return 0;
    const futureDate = new Date(date);
    const futureTimestamp = futureDate.getTime();
    return futureTimestamp;
  }

  const handleRadioChange = value => {
    setRadioValue(value);
    setExpiry(0);
    setExpiryState(value === 'on-purchase' ? 0 : 1); // this should change 0 ,1
    setExpiryTimeStamp(0);
    setExpiryMessage('');
  };

  const handleExpiryOnDateChange = date => {
    const current_date = new Date();
    if (date === '') {
      setExpiryMessage('');
      setExpiryTimeStamp('');
      return 0;
    }
    if (date <= new Date()) {
      setExpiryMessage('Expiry date must be in the future');
      return 0;
    } else if (
      date >= current_date.setFullYear(current_date.getFullYear() + 1)
    ) {
      setExpiryMessage(
        'Expiry date cannot be more than one year in the future',
      );
      return 0;
    }
    setExpiryMessage('');
    return 1;
  };

  const handleExpiryOnPurchaseChange = days => {
    try {
      if (days === '') {
        setExpiryMessage('');
        return 1;
      }
      const expiry = parseInt(days);
      if (expiry <= 0) {
        setExpiryMessage('Expiry must be a positive number');
        return 0;
      } else if (expiry > 365) {
        setExpiryMessage('Expiry must be less than 365 days');
        return 0;
      } else if (expiry % 1 !== 0) {
        setExpiryMessage('Expiry must be an integer');
        return 0;
      } else {
        setExpiryMessage('');
      }
    } catch (error) {
      setExpiryMessage('Expiry must be a number');
    }
  };

  const handleOnPurchaseChange = days => {
    if (handleExpiryOnPurchaseChange(days) === 0) return;
    setExpiry(days);
    setExpiryState(0);
    setExpiryTimeStamp(0);
  };

  const handleOnDateChange = date => {
    setExpiryTimeStamp(getTimeStampOnDate(date));
    setExpiry(0);
    setExpiryState(1);
  };

  return (
    <div className='border-gray-200'>
      <RadioGroup value={selectedOption} onChange={setSelectedOption}>
        <div className='mt-4 grid grid-cols-3 w-full px-[5%] sm:grid-cols-3 sm:gap-x-2 sm:w-full'>
          {options.map(option =>
            option.field_type === 'date' ? (
              <div className='col-start-2' key={option.id}>
                <div className='flex mb-4'>
                  <div className='flex items-center me-4'>
                    <input
                      id='on-purchase-radio'
                      type='radio'
                      value='on-purchase'
                      name='expiry-date-radio-group'
                      onChange={() => handleRadioChange('on-purchase')}
                      checked={radioValue === 'on-purchase'}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300'
                    />
                    <label
                      htmlFor='on-purchase-radio'
                      className='ms-2 text-l font-small text-gray-900'
                    >
                      On purchase
                    </label>
                  </div>
                  <div className='flex items-center me-4'>
                    <input
                      id='on-date-radio'
                      type='radio'
                      value='on-date'
                      name='expiry-date-radio-group'
                      onChange={() => handleRadioChange('on-date')}
                      checked={radioValue === 'on-date'}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300'
                    />
                    <label
                      htmlFor='on-date-radio'
                      className='ms-2 text-l font-small text-gray-900'
                    >
                      On date
                    </label>
                  </div>
                </div>
                {radioValue === 'on-date' ? (
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label='Expiry Date'
                        sx={{ width: '26ch' }}
                        onChange={handleOnDateChange}
                      />
                    </LocalizationProvider>
                    {expiryMessage && (
                      <p className='text-red-500'>{expiryMessage}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <TextField
                      id='expiry-days'
                      label='Days until expiry'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='start'>days</InputAdornment>
                        ),
                      }}
                      onChange={e => {
                        const inputValue = e.target.value;
                        handleOnPurchaseChange(inputValue);
                      }}
                      value={expiry === 0 ? '' : expiry}
                      focused
                    />
                    {expiryMessage && (
                      <p className='text-red-500'>{expiryMessage}</p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className='w-[90%] mb-5' key={option.id}>
                <RadioGroup.Option
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
}

export default RadioSeries;
