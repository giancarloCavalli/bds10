import './styles.css';

import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SpringPage } from 'types/vendor/spring';
import { Employee } from 'types/employee';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { hasAnyRoles } from 'util/auth';

const employeeHardCode = { // delete
  id: 1,
  name: "Carlos",
  email: "carlos@gmail.com",
  department: {
    id: 1,
    name: "Sales"
  }
};

type PageControl = {
  page: number
}

const List = () => {

  const [page, setPage] = useState<SpringPage<Employee>>();

  const [pageControl, setPageControl] = useState<PageControl>({page: 0});

  useEffect(() => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: "/employees",
      withCredentials: true,
      params: {
        page: pageControl.page,
        size: 5
      }
    };

    requestBackend(config)
      .then(response => {
        setPage(response.data);
      })

  }, [pageControl]);

  const handlePageChange = (pageNumber: number) => {
    setPageControl({...pageControl, page: pageNumber});
  };

  return (
    <>

      {
        hasAnyRoles(['ROLE_ADMIN'])
        && 
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      }

      {page && page.content.map((employee, i) => (<EmployeeCard employee={employee} key={i} />))}

      <Pagination
        forcePage={0}
        pageCount={page ? page.totalPages : 1}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
