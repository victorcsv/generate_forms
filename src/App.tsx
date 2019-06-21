import React, { useState } from 'react';
import { Formik, FormikProps, FieldArray } from 'formik';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css'

// TODO: Formatters
// TODO: Validations

interface ShowProps {
  if: boolean;
}

class Show extends React.Component<ShowProps> {
  render() {
    if (this.props.if && this.props.children) {
      return this.props.children;
    }
    return null;
  }
}

function newForm(): FormModel {
  return {
    title: '',
    description: '',
    fields: [
      newField(),
    ],
  };
}

function newField(): FieldModel {
  return {
    key: '',
    title: '',
    tip: '',
    type: 'text',
    required: false,
    width: 12,
  }
}

function formAddress(): FieldModel[] {
  return [
    { key: 'cep', title: 'CEP', tip: '', type: 'text', width: 2, required: true },
    { key: 'logradouro', title: 'Logradouro', tip: '', type: 'text', width: 5, required: true },
    { key: 'numero', title: 'Número', tip: '', type: 'text', width: 2, required: false },
    { key: 'complemento', title: 'Complemento', tip: '', type: 'text', width: 3, required: false },
    { key: 'bairro', title: 'Bairro', tip: '', type: 'text', width: 4, required: true },
    { key: 'cidade', title: 'Cidade', tip: '', type: 'text', width: 4, required: true },
    { key: 'estado', title: 'Estado', tip: '', type: 'text', width: 4, required: true },
  ];
}

type FieldType = 'text' | 'email' | 'number' | 'date' | 'select' | 'divider' | 'form';
type FieldWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

type FieldModel = {
  id?: number;
  key: string;
  title: string;
  tip: string;
  type: FieldType;
  required: boolean;
  width: FieldWidth;
  form?: string;
};

type FormModel = {
  id?: number;
  title: string;
  description: string;
  fields: FieldModel[];
};

interface State {
  form: FormModel;
}

export default function App() {
  const [form, setForm] = useState<FormModel>(newForm());
  const [showFormGenerator, setShowFormGenrator] = useState<boolean>(true);

  function handleSubmit(form: FormModel) {
    setForm(form);
    setShowFormGenrator(false);
  }

  function buildField(field: FieldModel, index: number) {
    if (field.type === 'divider') {
      return <div className="col-12" key={index}><hr /></div>;
    }
    if (!field.title) {
      return null;
    }
    return (
      <div className={`col-${field.width}`} key={index}>
        <div className="form-group">
          <label>{field.title}{field.required && " *"}:</label>
          <input type={field.type} name={field.key} required={field.required} className="form-control" />
          {field.tip && <small className="form-text text-muted">{field.tip}</small>}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Show if={showFormGenerator}>
        <h1>Gerador de formulário</h1>
        <p className="text-muted">Esse cadastro serve para gerar formulários de input de dados para os processos.</p>
        <Formik
          enableReinitialize
          initialValues={form}
          validationSchema={{}}
          validateOnBlur={true}
          validateOnChange={false}
          onSubmit={handleSubmit}
          render={({ handleChange, handleBlur, handleSubmit, errors, touched, values }: FormikProps<FormModel>) => {
            return (
              <form className="form-flex" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Título</label>
                  <input type="text" name="title" onChange={handleChange} onBlur={handleBlur} value={values.title} className="form-control" />
                  {touched.title && errors.title && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.title}</div>}
                </div>
                <div className="form-group">
                  <label>Breve descrição <small>(opcional)</small></label>
                  <textarea name="description" onChange={handleChange} onBlur={handleBlur} value={values.description} className="form-control" />
                  {touched.description && errors.description && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.description}</div>}
                </div>
                <h2>Campos</h2>
                <p>Adicione abaixo todos os campos que precisa nesse formulário.</p>
                <FieldArray name="fields" render={(fields) => (
                  <>
                    {values.fields.map((field: FieldModel, index: number) => (
                      <div className="row" key={index}>
                        <div className="col-2">
                          <div className="form-group">
                            <label>Tipo</label>
                            <select name={`fields.${index}.type`} onChange={handleChange} onBlur={handleBlur} className="form-control" autoFocus={!field.id && index > 0}>
                              <option value="text">Texto</option>
                              <option value="email">Email</option>
                              <option value="number">Número</option>
                              <option value="date">Data</option>
                              <option value="divider">Divisor</option>
                              <option value="form">Formulário</option>
                            </select>
                            {touched.fields && errors.fields && touched.fields[index] && errors.fields[index] && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.fields[index]!.type}</div>}
                          </div>
                        </div>
                        <div className="col-10">
                          <fieldset hidden={field.type !== 'form'}>
                            <div className="row">
                              <div className="col">
                                <div className="form-group">
                                  <label>Chave</label>
                                  <input type="text" name={`fields.${index}.key`} onChange={handleChange} onBlur={handleBlur} value={field.key} className="form-control" />
                                  {touched.fields && errors.fields && touched.fields[index] && errors.fields[index] && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.fields[index]!.key}</div>}
                                </div>
                              </div>
                              <div className="col">
                                <div className="form-group">
                                  <label>Formulário</label>
                                  <select name={`fields.${index}.form`} onChange={handleChange} onBlur={handleBlur} className="form-control">
                                    <option value=""></option>
                                    <option value="endereco">Endereço</option>
                                  </select>
                                  {touched.fields && errors.fields && touched.fields[index] && errors.fields[index] && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.fields[index]!.form}</div>}
                                </div>
                              </div>
                            </div>
                          </fieldset>
                          <fieldset hidden={['divider', 'form'].includes(field.type)}>
                            <div className="row">
                              <div className="col">
                                <div className="form-group">
                                  <label>Chave</label>
                                  <input type="text" name={`fields.${index}.key`} onChange={handleChange} onBlur={handleBlur} value={field.key} className="form-control" />
                                  {touched.fields && errors.fields && touched.fields[index] && errors.fields[index] && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.fields[index]!.key}</div>}
                                </div>
                              </div>
                              <div className="col">
                                <div className="form-group">
                                  <label>Título</label>
                                  <input type="text" name={`fields.${index}.title`} onChange={handleChange} onBlur={handleBlur} value={field.title} className="form-control" />
                                  {touched.fields && errors.fields && touched.fields[index] && errors.fields[index] && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.fields[index]!.title}</div>}
                                </div>
                              </div>
                              <div className="col">
                                <div className="form-group">
                                  <label>Dica</label>
                                  <input type="text" name={`fields.${index}.tip`} onChange={handleChange} onBlur={handleBlur} value={field.tip} className="form-control" />
                                  {touched.fields && errors.fields && touched.fields[index] && errors.fields[index] && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.fields[index]!.tip}</div>}
                                </div>
                              </div>
                              <div className="col">
                                <div className="form-group">
                                  <label>Requerido?</label>
                                  <select name={`fields.${index}.required`} onChange={handleChange} onBlur={handleBlur} className="form-control">
                                    <option value="true">Sim</option>
                                    <option value="false">Não</option>
                                  </select>
                                  {touched.fields && errors.fields && touched.fields[index] && errors.fields[index] && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.fields[index]!.type}</div>}
                                </div>
                              </div>
                              <div className="col">
                                <div className="form-group">
                                  <label>Tamanho</label>
                                  <select name={`fields.${index}.width`} onChange={handleChange} onBlur={handleBlur} className="form-control">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="11">11</option>
                                    <option value="12">12</option>
                                  </select>
                                  {touched.fields && errors.fields && touched.fields[index] && errors.fields[index] && <div className="invalid-feedback" style={{ display: 'block' }}>{errors.fields[index]!.width}</div>}
                                </div>
                              </div>
                            </div>
                          </fieldset>
                        </div>
                      </div>
                    ))}
                    <button className="btn btn-secondary" type="button" onClick={() => fields.push(newField())}>Adicionar Campo</button>
                  </>
                )} />
                <div className="actions mt-3">
                  <button className="btn btn-primary" type="submit">Gerar Formulário</button>
                </div>
              </form>
            );
          }}
        />
      </Show>
      <Show if={!showFormGenerator}>
        <div id="form" className="col mp-1" style={{ backgroundColor: '#f1f1f1', borderRadius: '3px', padding: '30px' }}>
          <h1>{form.title}</h1>
          {form.description && <p className="text-muted">{form.description}</p>}
          <div className="row">
            {form.fields.map((campo, index) => {
              if (campo.type === 'form') {
                if (campo.form && campo.form === 'endereco') {
                  return formAddress().map(buildField);
                }
              }
              return buildField(campo, index);
            }).filter(component => component !== null)}
          </div>
          {form.fields.filter(column => column.key !== '').length > 0 && <button className="btn btn-primary" type="button">Salvar</button>}
          <button className="btn btn-danger" onClick={() => setShowFormGenrator(true)}>Gerar novamente</button>
        </div>
      </Show>
    </div>
  );
}
