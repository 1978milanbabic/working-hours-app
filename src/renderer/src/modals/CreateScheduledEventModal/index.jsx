import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Button,
  Grid,
  GridColumn,
  GridRow,
  Header,
  Form,
  FormField,
  Modal,
  ModalActions,
  ModalContent,
  ModalHeader,
  Segment,
  Select,
  TextArea,
  FormGroup,
} from 'semantic-ui-react'
import { useUser } from '../../context/userContext'
import axios from 'axios'

const CreateScheduledEventModal = ({ open, closeModal, selectedDayForModal, clients, schedule }) => {
  const [selectClientOptions, setSelectClientOptions] = useState([])
  const [formData, setFormData] = useState({})
  const { token } = useUser()

  useEffect(() => {
    if (selectedDayForModal) {
      if (schedule) {
        // edit
        setFormData(schedule)
      } else {
        // new -> reset
        setFormData({})
      }
    }
  }, [selectedDayForModal, schedule])

  useEffect(() => {
    if (clients && clients.length > 0) {
      setSelectClientOptions(
        clients.map((cli) => {
          return {
            key: cli['_id'],
            value: cli['_id'],
            text: cli.firstName,
          }
        })
      )
    }
  }, [clients])

  const dayNames = ['ponedeljak', 'utorak', 'sreda', 'cetvrtak', 'petak', 'subota', 'nedelja']

  const taskOptions = [
    {
      key: 'Development',
      value: 'development',
      text: 'Development',
    },
    {
      key: 'Dizajn',
      value: 'dizajn',
      text: 'Dizajn',
    },
    {
      key: 'App Development',
      value: 'app development',
      text: 'App Development',
    },
    {
      key: 'Sastanak',
      value: 'sastanak',
      text: 'Sastanak',
    },
    {
      key: 'Testing',
      value: 'testing',
      text: 'Testing',
    },
    {
      key: 'Manager',
      value: 'manager',
      text: 'Manager',
    },
    {
      key: 'Marketing',
      value: 'marketing',
      text: 'Marketing',
    },
    {
      key: 'Support',
      value: 'support',
      text: 'Support',
    },
    {
      key: 'Akademija',
      value: 'akademija',
      text: 'Akademija',
    },
    {
      key: 'Mentorstvo',
      value: 'mentorstvo',
      text: 'Mentorstvo',
    },
    {
      key: 'Ostalo',
      value: 'ostalo',
      text: 'Ostalo',
    },
  ]

  let hoursOptions = []
  for (let i = 0; i <= 24; i++) {
    hoursOptions.push({
      key: `hour-${i}`,
      value: i,
      text: `${i}`,
    })
  }
  let minutesOptions = []
  for (let i = 0; i <= 59; i++) {
    minutesOptions.push({
      key: `minute-${i}`,
      value: i,
      text: `${i < 10 ? '0' + i : i}`,
    })
  }

  const handleChange = ({ name, value }) => {
    setFormData((prev) => {
      let data = prev
      data[name] = value
      return data
    })
  }

  const handleSubmit = () => {
    // check for fields
    if (
      formData &&
      formData.project &&
      formData.task &&
      formData.description &&
      (formData.uhours || formData.umins) &&
      (formData.eshours || formData.esmins)
    ) {
      let data = { formData, selectedDayForModal }
      if (schedule) {
        data.eventID = schedule.eventID
      }
      axios
        .post('http://localhost:5000/api/upsert-defaults', { ...data })
        .then((response) => {
          if (response?.data) {
            console.log(response.data)
            closeModal()
          }
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      alert('Sva polja su obavezna!')
    }
  }

  // useEffect(() => {
  //   if (formData) console.log(formData)
  // }, [formData])

  return (
    <Modal onClose={() => closeModal()} open={open}>
      <ModalHeader>
        {schedule ? 'Edituj' : 'Dodaj'} unos za sablon za <i>{dayNames[selectedDayForModal]}</i>
      </ModalHeader>
      <ModalContent style={{ padding: '10px' }}>
        <Grid celled>
          <GridRow>
            <GridColumn width={8}>
              <Header>Projekat</Header>
              <Select
                name='project'
                options={selectClientOptions}
                defaultValue={schedule ? schedule.project : null}
                placeholder='Select Project'
                onChange={(e, { name, value }) => handleChange({ name, value })}
                search
              />
            </GridColumn>
            <GridColumn width={8}>
              <Header>Task</Header>
              <Select
                name='task'
                options={taskOptions}
                defaultValue={schedule ? schedule.task : null}
                placeholder='Select Task'
                onChange={(e, { name, value }) => handleChange({ name, value })}
                search
              />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn width={8}>
              <Header>Opis</Header>
              <TextArea
                placeholder='opis'
                style={{ width: '400px', height: '150px' }}
                name='description'
                defaultValue={schedule ? schedule.description : ''}
                onChange={(e, { name, value }) => handleChange({ name, value })}
              />
            </GridColumn>
            <GridColumn width={8}>
              <Header>Utroseno vreme</Header>
              <Select
                options={hoursOptions}
                search
                compact
                defaultValue={schedule && schedule.uhours ? schedule.uhours : hoursOptions[0].value}
                name='uhours'
                onChange={(e, { name, value }) => handleChange({ name, value })}
              />{' '}
              :{' '}
              <Select
                options={minutesOptions}
                search
                compact
                defaultValue={schedule && schedule.umins ? schedule.umins : minutesOptions[0].value}
                name='umins'
                onChange={(e, { name, value }) => handleChange({ name, value })}
              />
              <Header>Estimirano vreme</Header>
              <Select
                options={hoursOptions}
                search
                compact
                defaultValue={schedule && schedule.eshours ? schedule.eshours : hoursOptions[0].value}
                name='eshours'
                onChange={(e, { name, value }) => handleChange({ name, value })}
              />{' '}
              :{' '}
              <Select
                options={minutesOptions}
                search
                compact
                defaultValue={schedule && schedule.esmins ? schedule.esmins : minutesOptions[0].value}
                name='esmins'
                onChange={(e, { name, value }) => handleChange({ name, value })}
              />
            </GridColumn>
          </GridRow>
        </Grid>
      </ModalContent>
      <ModalActions>
        <Button primary onClick={handleSubmit}>
          Submit
        </Button>
        <Button onClick={() => closeModal()}>Cancel</Button>
      </ModalActions>
    </Modal>
  )
}

export default CreateScheduledEventModal
