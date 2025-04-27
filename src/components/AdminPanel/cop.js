import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, blockUser, deleteUser, clearError as clearAuthError } from '../../store/authSlice';
import { fetchReviews, deleteReview, clearError as clearReviewsError, blockReview } from '../../store/reviewsSlice';
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  flexRender,
  getPaginationRowModel,
  ColumnOrderState
} from '@tanstack/react-table';
import { Button, Card, Alert, Spinner, Table } from 'react-bootstrap';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import useWindowSize from '../../hooks/useWindowSize';
import { useVirtualizer } from '@tanstack/react-virtual';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import './AdminPanel.scss'

// Компонент для перетаскивания колонок
const DraggableColumnHeader = ({ header, reorderColumn }) => {
  const { id } = header.column;
  
  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN_DRAG',
    item: () => ({ id }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'COLUMN_DRAG',
    drop: (draggedItem) => {
      if (draggedItem.id !== id) {
        reorderColumn(draggedItem.id, id);
      }
    },
  });

  return (
    <th
      ref={(node) => drag(drop(node))}
      colSpan={header.colSpan}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        width: header.getSize(),
        position: 'relative',
      }}
      onClick={header.column.getToggleSortingHandler()}
      className="user-select-none"
    >
      <div className="d-flex align-items-center justify-content-between">
        {flexRender(header.column.columnDef.header, header.getContext())}
        <span>
          {{
            asc: ' 🔼',
            desc: ' 🔽',
          }[header.column.getIsSorted()] ?? null}
        </span>
      </div>
      <div
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
      />
    </th>
  );
};

// Компонент для виртуализированного списка строк
const VirtualizedTableBody = ({ table, cellWidths }) => {
  const { rows } = table.getRowModel();
  const tableContainerRef = React.useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 50, // Примерная высота строки
    getScrollElement: () => tableContainerRef.current,
    overscan: 10, // Количество дополнительных строк для предзагрузки
  });

  // Получаем текущие размеры колонок
  const columnSizes = table.getHeaderGroups()[0]?.headers.map(header => ({
    id: header.id,
    size: header.getSize(),
  })) || [];
  
  return (
    <div 
      ref={tableContainerRef}
      style={{
        height: `100px`,
        overflow: 'auto',
    }}>
      <table style={{
          width: '100%',
          tableLayout: 'fixed',
          position: 'relative',
          borderSpacing: 0
        }}>
    <tbody style={{ position: 'relative', height: `${rowVirtualizer.getTotalSize()}px`}}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index];
        return (
          <tr
            key={row.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {row.getVisibleCells().map(cell => {
              const columnSize = columnSizes.find(c => c.id === cell.column.id)?.size || 150;
              return(
                  <td
                    key={cell.id}
                    style={{
                      width: `${columnSize}px`,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      boxSizing: 'border-box'
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const AdminPanel = () => {
  const dispatch = useDispatch();
  const { usersList, loading: usersLoading, error: usersError } = useSelector(state => state.auth);
  const { reviews, loading: reviewsLoading, error: reviewsError } = useSelector(state => state.reviews);
  const currentUser = useSelector(state => state.auth.user);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 768;

  // Состояние для порядка колонок
  const [usersColumnOrder, setUsersColumnOrder] = React.useState([]);
  const [reviewsColumnOrder, setReviewsColumnOrder] = React.useState([]);
  const [columnResizeMode, setColumnResizeMode] = React.useState('onChange');

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchReviews());
  }, [dispatch]);

  const handleBlockUser = async (userId) => {
    await dispatch(blockUser(userId));
    dispatch(fetchUsers());
  };

  const handleBlockReview = async (reviewId) => {
    await dispatch(blockReview(reviewId));
    dispatch(fetchReviews());
  };

  const handleDeleteUser = async (userId) => {
    await dispatch(deleteUser(userId));
    dispatch(fetchUsers());
  };

  const handleDeleteReview = async (reviewId) => {
    await dispatch(deleteReview({ 
      reviewId, 
      userId: currentUser.id 
    }));
    dispatch(fetchReviews());
  };

  const usersColumns = useMemo(() => [
    { 
      accessorKey: 'id', 
      header: 'ID',
      size: 130,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '50px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'name', 
      header: 'Имя',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '150px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'email', 
      header: 'Email',
      size: 250,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '200px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'role', 
      header: 'Роль',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '120px' }}>
          {getValue()}
        </div>
      )
    },
    {
      accessorKey: 'blocked',
      header: 'Статус',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '120px' }}>
          {getValue() ? 'Заблокирован' : 'Активен'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Действия',
      size: 300,
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            variant={row.original.blocked ? 'success' : 'warning'}
            size="sm"
            onClick={() => handleBlockUser(row.original.id)}
            disabled={usersLoading}
          >
            {row.original.blocked ? 'Разблокировать' : 'Заблокировать'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteUser(row.original.id)}
            disabled={usersLoading}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ], [usersLoading]);

  const reviewsColumns = useMemo(() => [
    { 
      accessorKey: 'id', 
      header: 'ID',
      size: 130,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '50px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'name', 
      header: 'Имя',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '150px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'email', 
      header: 'Email',
      size: 250,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '200px' }}>
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'message', 
      header: 'Текст',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate">
          {getValue()}
        </div>
      )
    },
    { 
      accessorKey: 'date', 
      header: 'Дата',
      size: 200,
      cell: ({ getValue }) => (
        <div className="text-truncate" style={{ width: '120px' }}>
          {getValue()}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Действия',
      size: 300,
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            variant={row.original.blocked ? 'success' : 'warning'}
            size="sm"
            onClick={() => handleBlockReview(row.original.id)}
            disabled={reviewsLoading}
          >
            {row.original.blocked ? 'Разблокировать' : 'Заблокировать'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteReview(row.original.id)}
            disabled={reviewsLoading}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ], [reviewsLoading]);

  const reorderUsersColumn = (draggedColumnId, targetColumnId) => {
    const newColumnOrder = [...usersColumnOrder];
    const draggedIndex = newColumnOrder.indexOf(draggedColumnId);
    const targetIndex = newColumnOrder.indexOf(targetColumnId);
    
    newColumnOrder.splice(draggedIndex, 1);
    newColumnOrder.splice(targetIndex, 0, draggedColumnId);
    
    setUsersColumnOrder(newColumnOrder);
  };

  const reorderReviewsColumn = (draggedColumnId, targetColumnId) => {
    const newColumnOrder = [...reviewsColumnOrder];
    const draggedIndex = newColumnOrder.indexOf(draggedColumnId);
    const targetIndex = newColumnOrder.indexOf(targetColumnId);
    
    newColumnOrder.splice(draggedIndex, 1);
    newColumnOrder.splice(targetIndex, 0, draggedColumnId);
    
    setReviewsColumnOrder(newColumnOrder);
  };

  const usersTable = useReactTable({
    data: usersList,
    columns: usersColumns,
    state: {
      columnOrder: usersColumnOrder,
    },
    onColumnOrderChange: setUsersColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode,
  });

  const reviewsTable = useReactTable({
    data: reviews,
    columns: reviewsColumns,
    state: {
      columnOrder: reviewsColumnOrder,
    },
    onColumnOrderChange: setReviewsColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    columnResizeMode,
  });

  // Инициализация порядка колонок после загрузки данных
  useEffect(() => {
    if (usersList.length > 0 && usersColumnOrder.length === 0) {
      setUsersColumnOrder(usersTable.getAllLeafColumns().map(column => column.id));
    }
  }, [usersList, usersColumnOrder]);

  useEffect(() => {
    if (reviews.length > 0 && reviewsColumnOrder.length === 0) {
      setReviewsColumnOrder(reviewsTable.getAllLeafColumns().map(column => column.id));
    }
  }, [reviews, reviewsColumnOrder]);

  const usersCellWidths = useMemo(() => {
    return usersTable.getHeaderGroups()[0]?.headers.map(header => header.getSize()) || [];
  }, [usersTable.getState().columnOrder, usersTable.getState().columnSizing]);

  const reviewsCellWidths = useMemo(() => {
    return reviewsTable.getHeaderGroups()[0]?.headers.map(header => header.getSize()) || [];
  }, [reviewsTable.getState().columnOrder, reviewsTable.getState().columnSizing]);

  if (usersLoading || reviewsLoading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mt-4" >
        <h2>Панель администратора</h2>
        
        {usersError && (
          <Alert variant="danger" onClose={() => dispatch(clearAuthError())} dismissible>
            {usersError}
          </Alert>
        )}
        
        {reviewsError && (
          <Alert variant="danger" onClose={() => dispatch(clearReviewsError())} dismissible>
            {reviewsError}
          </Alert>
        )}

        <Card className="mb-4">
          <Card.Header>
            <h3>Пользователи</h3>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead>
                  {usersTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} style={{ display: 'flex' }}>
                      {headerGroup.headers.map((header, index) => (
                        <DraggableColumnHeader 
                          key={header.id} 
                          header={header} 
                          reorderColumn={reorderUsersColumn}
                          style={{ 
                            width: `${usersCellWidths[index]}px`,
                            flexShrink: 0
                          }}        
                        />
                      ))}
                    </tr>
                  ))}
                </thead>
                </Table>
                  <VirtualizedTableBody 
                    table={usersTable} 
                    cellWidths={usersCellWidths}
                  />
            </div>
            <div className="d-flex justify-content-between mt-3">
              <div className="d-flex gap-1">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => usersTable.setPageIndex(0)}
                  disabled={!usersTable.getCanPreviousPage()}
                >
                  {'<<'}
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => usersTable.previousPage()}
                  disabled={!usersTable.getCanPreviousPage()}
                >
                  {'<'}
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => usersTable.nextPage()}
                  disabled={!usersTable.getCanNextPage()}
                >
                  {'>'}
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => usersTable.setPageIndex(usersTable.getPageCount() - 1)}
                  disabled={!usersTable.getCanNextPage()}
                >
                  {'>>'}
                </Button>
              </div>
              <span className="d-flex align-items-center">
                Страница{' '}
                <strong>
                  {usersTable.getState().pagination.pageIndex + 1} из{' '}
                  {usersTable.getPageCount()}
                </strong>
              </span>
              <select
                value={usersTable.getState().pagination.pageSize}
                onChange={e => {
                  usersTable.setPageSize(Number(e.target.value));
                }}
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Показать {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>
            <h3>Отзывы</h3>
          </Card.Header>
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead>
                  {reviewsTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} style={{ display: 'flex' }}>
                      {headerGroup.headers.map((header, index) => (
                        <DraggableColumnHeader 
                          key={header.id} 
                          header={header} 
                          reorderColumn={reorderReviewsColumn}
                          style={{ 
                            width: `${reviewsCellWidths[index]}px`,
                            flexShrink: 0
                          }}
                        />
                      ))}
                    </tr>
                  ))}
                </thead>
                </Table>
                  <VirtualizedTableBody 
                    table={reviewsTable}
                    cellWidths={reviewsCellWidths}
                  />
            </div>
            <div className="d-flex justify-content-between mt-3">
              <div className="d-flex gap-1">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => reviewsTable.setPageIndex(0)}
                  disabled={!reviewsTable.getCanPreviousPage()}
                >
                  {'<<'}
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => reviewsTable.previousPage()}
                  disabled={!reviewsTable.getCanPreviousPage()}
                >
                  {'<'}
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => reviewsTable.nextPage()}
                  disabled={!reviewsTable.getCanNextPage()}
                >
                  {'>'}
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => reviewsTable.setPageIndex(reviewsTable.getPageCount() - 1)}
                  disabled={!reviewsTable.getCanNextPage()}
                >
                  {'>>'}
                </Button>
              </div>
              <span className="d-flex align-items-center">
                Страница{' '}
                <strong>
                  {reviewsTable.getState().pagination.pageIndex + 1} из{' '}
                  {reviewsTable.getPageCount()}
                </strong>
              </span>
              <select
                value={reviewsTable.getState().pagination.pageSize}
                onChange={e => {
                  reviewsTable.setPageSize(Number(e.target.value));
                }}
                className="form-select form-select-sm"
                style={{ width: 'auto' }}
              >
                {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Показать {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </Card.Body>
        </Card>
      </div>
    </DndProvider>
  );
};

export default AdminPanel;