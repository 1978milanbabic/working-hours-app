import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Grid,
  GridColumn,
  GridRow,
  Header,
  Input,
  Modal,
  ModalActions,
  ModalContent,
  ModalHeader,
  Segment,
  Select,
  TextArea,
} from 'semantic-ui-react'
import { useUser } from '../../context/userContext'
import axios from 'axios'

const CreateEventModal = ({ open, closeModal, selectedDayForModal }) => {
  const [clients, setClients] = useState([])
  const [selectClientOptions, setSelectClientOptions] = useState([])
  const { token } = useUser()

  useEffect(() => {
    if (selectedDayForModal) {
      // console.log('🚀 -> useEffect -> selectedDayForModal:\n\r', selectedDayForModal)
    }
  }, [selectedDayForModal])

  useMemo(() => {
    axios
      .get('http://localhost:5000/api/clients')
      .then((resp) => {
        if (resp?.data?.clients) {
          setClients(resp.data.clients)
        }
      })
      .catch((err) => {
        console.log(err)
        logout()
      })
  }, [])

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
      text: `${i}`,
    })
  }

  return (
    <Modal onClose={() => closeModal()} open={open}>
      <ModalHeader>
        Dodaj unos za <i>{selectedDayForModal}</i>
      </ModalHeader>
      <ModalContent style={{ padding: '10px' }}>
        <Grid celled>
          <GridRow>
            <GridColumn width={8}>
              <Header>Projekat</Header>
              <Select options={selectClientOptions} placeholder='Select Project' search />
            </GridColumn>
            <GridColumn width={8}>
              <Header>Task</Header>
              <Select options={taskOptions} placeholder='Select Task' search />
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn width={8}>
              <Header>Opis</Header>
              <TextArea placeholder='opis' style={{ width: '400px', height: '150px' }} />
            </GridColumn>
            <GridColumn width={8}>
              <Header>Utroseno vreme</Header>
              <Select options={hoursOptions} search compact defaultValue={hoursOptions[0].value} /> :{' '}
              <Select options={minutesOptions} search compact defaultValue={minutesOptions[0].value} />
              <Header>Estimirano vreme</Header>
              <Select options={hoursOptions} search compact defaultValue={hoursOptions[0].value} /> :{' '}
              <Select options={minutesOptions} search compact defaultValue={minutesOptions[0].value} />
            </GridColumn>
          </GridRow>
        </Grid>
      </ModalContent>
      <ModalActions>
        <Button primary>Submit</Button>
        <Button onClick={() => closeModal()}>Cancel</Button>
      </ModalActions>
    </Modal>
  )
}

export default CreateEventModal
