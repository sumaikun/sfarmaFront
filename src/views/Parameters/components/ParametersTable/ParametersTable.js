import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  //Checkbox,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

//import { getInitials } from 'helpers';
//import  api  from '../../../../middleware/api'

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const ParametersTable = props => {
  const { className, headers, columns, data, ...rest  } = props;

   console.log("headers",headers) 

   console.log("data",data)

  const classes = useStyles();


  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);


  const handlePageChange = (event, page) => {
    console.log("handle change",event,page)
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    console.log("rows per page event")
    setRowsPerPage(event.target.value);
    setPage(0)
  };

  const [species, setSpecies ] = useState([]);

  useEffect(() => {

    const getSpecies = async () => {

      //const response = await api.getData("species") 
      
      //setSpecies(response.data) 
    }

    getSpecies()

  },[]); 

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  
                 {
                    headers.map(header => (
                        <TableCell>{header}</TableCell>
                    ))
                 }

                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(data => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={data.id}
                    
                  >
                    {columns.map(
                      cell => (
                        <TableCell>
                          { cell === "options" ?  
                          <div>
                            <Button onClick={ () => { props.editButton(data) } } >Editar</Button>
                            <Button onClick={ () => { props.deleteButton(data) } } >Eliminar</Button>
                          </div> :
                          cell === 'date' ? data[cell].split(" ")[0]:
                          cell === 'species' ? 
                            species.filter( specie => specie._id === data[cell] )[0].name  :
                          data[cell] }
                        </TableCell>
                      )
                    )}                    
                  
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={data.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

ParametersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default ParametersTable;
