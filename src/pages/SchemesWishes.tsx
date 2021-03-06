import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getProducts, saveProducts } from "../redux/actions/products";
import { setStep } from "../redux/actions/steps";
import { ProductsStateTypes, MatchProps, ProductsData } from "../types";
import NumberFormat from "react-number-format";

import { useStyles } from "../styles";

import { CustomTooltip } from "../components";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Toolbar,
  TextField,
} from "@material-ui/core";

import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Redo as RedoIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Functions as FunctionsIcon,
} from "@material-ui/icons";
import { useHistory } from "react-router-dom";

type ColumnsTypes = {
  id: keyof ProductsData;
  label: string;
  align?: "right";
};

const columns: ColumnsTypes[] = [
  {
    id: "code",
    label: "Код",
  },
  {
    id: "name",
    label: "Наименование позиции",
  },
  {
    id: "amount",
    label: "Объем, т",
  },
  {
    id: "price",
    label: "Цена, руб\u002fкг",
  },
  {
    id: "curr_rent",
    label: "Рент-сть, %",
    align: "right",
  },
  {
    id: "last_volume",
    label: "Объем, т",
    align: "right",
  },
  {
    id: "last_price",
    label: "Цена,\u00a0руб\u002fкг",
    align: "right",
  },
  {
    id: "last_rent",
    label: "Рент-сть,\u00a0%",
    align: "right",
  },
];

const selectProducts = ({ products: { products } }: ProductsStateTypes) =>
  products;

const EditTable = ({ match }: MatchProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id: model, id2: scheme } = match.params;

  const rows = useSelector(selectProducts);

  useEffect(() => {
    dispatch(setStep(6));
    dispatch(getProducts(model, scheme));
  }, [dispatch, model, scheme]);

  interface EditRowTypes {
    [id: number]: {
      amount: number;
      price: number;
    };
  }

  const [editRow, setEditRow] = useState<EditRowTypes>({});

  const handleClickEditTable = (id: number, amount: number, price: number) => {
    setEditRow({
      ...editRow,
      [id]: { price, amount },
    });
  };

  const handleChangeEditField = (
    { value }: any,
    id: number,
    target: string
  ) => {
    setEditRow({
      ...editRow,
      [id]: {
        ...editRow[id],
        [target]: +value,
      },
    });
  };

  const handleClickCancel = (id: number) => {
    const newRows = { ...editRow };
    delete newRows[id];
    setEditRow(newRows);
  };

  const handleClickSave = (id: number, index: number) => {
    dispatch(saveProducts({ index, values: editRow[id] }));
    handleClickCancel(id);
  };

  const history = useHistory();

  const handleClickBack = () => {
    history.push(`/${model}/schemes/${scheme}/launch`);
  };

  const handleClickCalc = () => {
    alert("Рассчитать линейно");
  };

  const handleClickNotSave = () => {
    history.push(`/${model}/schemes/${scheme}/purchase/1`);
  };

  return (
    <Paper className={classes.root}>
      <Toolbar className={classes.toolBar}>
        <div className="left-side">
          <CustomTooltip title="Расчёт">
            <IconButton
              color="secondary"
              aria-label="back"
              onClick={handleClickBack}
            >
              <KeyboardBackspaceIcon />
            </IconButton>
          </CustomTooltip>
        </div>
        <Typography variant="h6" component="h2">
          Ввод плана продаж готовой продукции
        </Typography>
        <div className="right-side">
          <CustomTooltip title="Продолжить без сохранения">
            <IconButton
              color="secondary"
              aria-label="not save"
              onClick={handleClickNotSave}
            >
              <RedoIcon />
            </IconButton>
          </CustomTooltip>
          <CustomTooltip title="Рассчитать линейно">
            <IconButton
              color="secondary"
              aria-label="calculate"
              onClick={handleClickCalc}
            >
              <FunctionsIcon />
            </IconButton>
          </CustomTooltip>
        </div>
      </Toolbar>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow className={classes.header}>
              <TableCell colSpan={2} />
              <TableCell colSpan={3} align="center">
                Корректируемое решение
              </TableCell>
              <TableCell colSpan={3} align="center">
                План продаж
              </TableCell>
              <TableCell />
            </TableRow>
            <TableRow className={classes.header}>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(
              (
                {
                  id,
                  code,
                  name,
                  last_volume,
                  last_price,
                  last_rent,
                  amount,
                  price,
                  curr_rent,
                },
                index
              ) => {
                const isEditRow = editRow.hasOwnProperty(id);

                return (
                  <TableRow key={id}>
                    <TableCell>{code}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      {isEditRow ? (
                        <NumberFormat
                          value={editRow[id].amount}
                          onValueChange={({ value: v }) =>
                            handleChangeEditField({ value: v }, id, "amount")
                          }
                          thousandSeparator={" "}
                          customInput={TextField}
                          InputProps={{
                            color: "secondary",
                          }}
                        />
                      ) : (
                        +last_volume
                      )}
                    </TableCell>
                    <TableCell>
                      {isEditRow ? (
                        <NumberFormat
                          value={editRow[id].price}
                          onValueChange={({ value: v }) =>
                            handleChangeEditField({ value: v }, id, "price")
                          }
                          thousandSeparator={" "}
                          suffix={"\u20BD"}
                          customInput={TextField}
                          InputProps={{
                            color: "secondary",
                          }}
                        />
                      ) : (
                        +last_price.toFixed(2)
                      )}
                    </TableCell>
                    <TableCell>{+last_rent.toFixed(2)}</TableCell>
                    <TableCell>{+amount}</TableCell>
                    <TableCell>{+price.toFixed(2)}</TableCell>
                    <TableCell>{+curr_rent.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      {isEditRow ? (
                        <>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleClickSave(id, index)}
                          >
                            <SaveIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleClickCancel(id)}
                            size="small"
                            color="secondary"
                          >
                            <CancelIcon />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={() =>
                            handleClickEditTable(id, +last_volume, last_price)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EditTable;
