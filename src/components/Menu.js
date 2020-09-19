import React, {Fragment} from 'react'
import {Divider, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core'
import items from './menuData'

function Menu(props) {
  let val = 0
  return(
      <div>
        {items.map((group) => {
            return (
              <Fragment key={++val}>
                <Divider />
                <List>
                  {group.map((item, key) => {
                      return(
                      <ListItem button key={key} selected={props.active.name === item.name} onClick={() => props.setActive(item)}>
                           <ListItemIcon>
                              <item.icon />
                           </ListItemIcon>
                         <ListItemText primary={item.label} />
                       </ListItem>
                     )
                    })
                  }
                </List>
              </Fragment>
            )
          })}


      </div>
  )
}

export default Menu;
