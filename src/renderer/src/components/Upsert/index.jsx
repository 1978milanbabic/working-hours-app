import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../../context/userContext'
import axios from 'axios'
import { Button, Container, Header, Segment, GridRow, GridColumn, Grid } from 'semantic-ui-react'
import CreateScheduledEventModal from '../../modals/CreateScheduledEventModal'

const Upsert = (props) => {
  const { user } = useUser()
  const location = useLocation()
  const navigate = useNavigate()
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [savedSchedules, setSavedSchedules] = useState([])
  const [clients, setClients] = useState()
  const [summedHours, setSummedHours] = useState('')
  const [schedule, setSchedule] = useState()

  const dayNames = ['ponedeljak', 'utorak', 'sreda', 'cetvrtak', 'petak', 'subota', 'nedelja']
  let currentDayNumber = location.pathname.split('/')
  currentDayNumber = currentDayNumber[currentDayNumber.length - 1]
  const currentDayName = dayNames[currentDayNumber]

  const handleCloseModal = () => {
    setOpenCreateModal(false)
    setSchedule(null)
  }

  // get clients
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
      })
  }, [])

  // get saved schedule
  useEffect(() => {
    // pull schedules from DB
    if (!openCreateModal && clients) {
      // wait for tinyDB to update
      setTimeout(() => {
        axios
          .get(`http://localhost:5000/api/default/${currentDayNumber}`)
          .then((resp) => {
            let saved = resp?.data?.returnDay || []
            setSavedSchedules(saved)
            // calulate summed hours
            if (saved && saved.length > 0) {
              let timeSum = 0
              saved.forEach((s) => {
                if (s.uhours) timeSum += s.uhours * 60
                if (s.umins) timeSum += s.umins
              })
              setSummedHours(`${parseInt(timeSum / 60)} : ${timeSum % 60 < 10 ? '0' + (timeSum % 60) : timeSum % 60}`)
            } else {
              setSummedHours(`0 : 00`)
            }
          })
          .catch((err) => console.log(err))
      }, 1000)
    }
  }, [openCreateModal, clients])

  // remove an event
  const handleRemoveEvent = (id) => {
    axios
      .patch(`http://localhost:5000/api/default/`, { id, currentDayNumber })
      .then((resp) => {
        window.location.reload()
      })
      .catch((err) => console.log(err))
  }

  // edit an event
  const handleEditEvent = (id) => {
    setSchedule(savedSchedules.find((s) => s.eventID === id))
    setTimeout(() => {
      setOpenCreateModal(true)
    }, 500)
  }

  // additional styles
  const smallRowStyle = { padding: '0.5rem 0' }

  return (
    <div style={{ padding: '10px 0', height: '100vh', maxWidth: '600px', margin: '0 auto' }}>
      <Container style={{ maxWidth: '600px !important' }}>
        <Segment attached='top'>
          <Header>
            Sablon za {currentDayName}
            <Button primary floated='right' style={{ transform: 'translateY(-6px)' }} onClick={() => navigate('/')}>{`< Nazad`}</Button>
          </Header>
        </Segment>
        {savedSchedules &&
          savedSchedules.length > 0 &&
          savedSchedules.map((sc, scindex) => (
            <Segment attached key={`schedule-${sc.eventID || scindex}`}>
              <Grid>
                <GridRow style={smallRowStyle}>
                  <GridColumn width={5}>
                    <p>Projekat:</p>
                  </GridColumn>
                  <GridColumn width={11}>
                    <p>
                      <em>
                        <strong>{clients.find((cl) => cl['_id'] === sc.project).firstName}</strong>
                      </em>
                    </p>
                  </GridColumn>
                </GridRow>
                <GridRow style={smallRowStyle}>
                  <GridColumn width={5}>
                    <p>Task:</p>
                  </GridColumn>
                  <GridColumn width={11}>
                    <p>
                      <em>
                        <strong>{sc.task}</strong>
                      </em>
                    </p>
                  </GridColumn>
                </GridRow>
                <GridRow style={smallRowStyle}>
                  <GridColumn width={5}>
                    <p>Opis:</p>
                  </GridColumn>
                  <GridColumn width={11}>
                    <p>
                      <em>{sc.description}</em>
                    </p>
                  </GridColumn>
                </GridRow>
                <GridRow style={smallRowStyle}>
                  <GridColumn width={5}>
                    <p>Utroseno vreme:</p>
                  </GridColumn>
                  <GridColumn width={11}>
                    <p>
                      <em>
                        <strong>
                          {sc?.uhours || 0} : {sc?.umins ? (sc.umins < 10 ? '0' + sc.umins : sc.umins) : '00'}
                        </strong>
                      </em>
                    </p>
                  </GridColumn>
                </GridRow>
                <GridRow style={smallRowStyle}>
                  <GridColumn width={5}>
                    <p>Estimirano vreme:</p>
                  </GridColumn>
                  <GridColumn width={11}>
                    <p>
                      <em>
                        <strong>
                          {sc?.eshours || 0} : {sc?.esmins ? (sc.esmins < 10 ? '0' + sc.esmins : sc.esmins) : '00'}
                        </strong>
                      </em>
                    </p>
                  </GridColumn>
                  <GridColumn width={16}>
                    <br />
                    <Button onClick={() => handleEditEvent(sc.eventID)}>Edit</Button>
                    <Button onClick={() => handleRemoveEvent(sc.eventID)}>Remove</Button>
                  </GridColumn>
                </GridRow>
              </Grid>
            </Segment>
          ))}
        <Segment attached>
          <Button
            onClick={() => {
              setOpenCreateModal(true)
            }}
          >
            Dodaj
          </Button>
        </Segment>
        <Segment attached>
          <Header>Ukupno vreme: &emsp;{summedHours}</Header>
        </Segment>
        <Segment attached='bottom'>
          <Button primary onClick={() => navigate('/')}>
            {`< Nazad`}
          </Button>
        </Segment>
      </Container>
      <CreateScheduledEventModal
        open={openCreateModal}
        closeModal={handleCloseModal}
        selectedDayForModal={currentDayNumber}
        clients={clients}
        schedule={schedule}
      />
    </div>
  )
}

export default Upsert
