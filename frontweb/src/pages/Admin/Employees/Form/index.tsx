import { errors } from 'msw/lib/types/context';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Employee } from 'types/employee';
import { Department } from 'types/department';
import './styles.css';
import { AxiosRequestConfig } from 'axios';
import { requestBackend } from 'util/requests';
import { toast } from 'react-toastify';

const Form = () => {

  const [selectDepartments, setSelectDepartments] = useState<Department[]>();

  useEffect(() => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: "/departments  ",
      withCredentials: true
    }

    requestBackend(config)
      .then(response => {
        setSelectDepartments(response.data);
      })
      .catch(error => {
        console.log("Erro", error);
      })
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<Employee>();

  const history = useHistory();

  const handleCancel = () => {
    history.push("/admin/employees");
  };

  const onSubmit = (formData: Employee) => {
    const config: AxiosRequestConfig = {
      method: "POST",
      url: "/employees",
      withCredentials: true,
      data: formData
    };

    requestBackend(config)
      .then(response => {
        toast.info("Cadastrado com sucesso");
        history.push("/admin/employees");
      })
      .catch(error => {
        toast.error("Erro ao cadastrar funcionário")
      });
  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">

              <div className="margin-bottom-30">
                <input
                  type="text"
                  className={`form-control base-input ${errors.name ? "is-invalid" : ""}`}
                  data-testid="name"
                  {...register("name", {
                    required: "Campo obrigatório"
                  })}
                  name='name'
                  placeholder='Nome do funcionário'
                />
                <div className="invalid-feedback d-block">
                  {errors.name?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <input
                  type="text"
                  className={`form-control base-input ${errors.email ? "is-invalid" : ""}`}
                  data-testid="email"
                  {...register("email", {
                    required: "Campo obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido"
                    }
                  })}
                  name="email"
                  placeholder='Email do funcionário'
                />
                <div className="invalid-feedback d-block">
                  {errors.email?.message}
                </div>
              </div>

              <div className="margin-bottom-30">
                <label htmlFor="department" className='d-none'>Departamento</label>
                <Controller
                  name='department'
                  rules={{ required: true }}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={selectDepartments}
                      placeholder="Departamento"
                      getOptionLabel={(department: Department) => department.name}
                      getOptionValue={(department: Department) => String(department.id)}
                      inputId='department'
                    />
                  )}
                />
                {errors.department && (
                  <div className="invalid-feedback d-block">
                    Campo obrigatório
                  </div>
                )}
              </div>

            </div>
          </div>
          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
