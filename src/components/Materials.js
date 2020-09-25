import React from 'react';
import {Container} from '@material-ui/core'
import MaterialsTb from '../components/tables/MaterialsTb'


export default function FullWidthTabs() {



  return (
    <div>

        <Container fixed maxWidth="lg">
          <MaterialsTb url='materials' title='Materiales' label='material' />
        </Container>



    </div>
  );
}
