import React from 'react'
import {Divider, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core'
import items from './menuData'

function Menu(props) {
  return(
      <div>
        <div  />
        {items.map((group) => {
            return (
              <div>
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
              </div>
            )
          })}


      </div>
  )
}

export default Menu;
