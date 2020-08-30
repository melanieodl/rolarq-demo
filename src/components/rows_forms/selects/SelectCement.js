import React, {Fragment} from 'react';

import AsyncSelect from 'react-select/async';
//
import api from '../../../api'


  // const [field, meta] = useField(props);


  const promiseOptions = inputValue =>
    new Promise(resolve => {
      api.get('cements/prices')
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {

      })
    });

  export default function CustomizedSelect() {
      return (
        <AsyncSelect cacheOptions defaultOptions loadOptions={promiseOptions} />
      );

  }
