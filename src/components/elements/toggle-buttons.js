import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToggleButtons(props) {
  const [v, setV] = React.useState(props.defaultValue);

  React.useEffect(() => {
    props.handleChange(v);
  }, [v]);

  return (
    <ToggleButtonGroup
      value={v}
      exclusive
      onChange={(_, v) => setV(v)}
      size='small'
    >
      {props.options.map((option, index) => (
        <ToggleButton key={index} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
