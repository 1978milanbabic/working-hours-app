import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../context/userContext'
import {
  Container,
  Header,
  Segment,
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableRow,
  TableCell,
  TableHeaderCell,
  Button,
  Message,
  MessageHeader,
} from 'semantic-ui-react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advanced from 'dayjs/plugin/advancedFormat'
import CreateEventModal from '../../modals/CreateEventModal'
import axios from 'axios'
import './Home.css'

// dayjs setup
dayjs.extend(timezone)
dayjs.extend(utc)
dayjs.extend(advanced)
dayjs.tz.setDefault('Europe/London')

const Home = () => {
  const { user, logout, token } = useUser()
  // dateys today raw format
  const [rawToday, setRawToday] = useState(dayjs())
  // day in week
  const [todayDay, setTodayDay] = useState(7)
  // refined today format
  const [dateNow, setDateNow] = useState(dayjs())
  // this week
  const [calDays, setCalDays] = useState([])
  // modal
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [selectedDayForModal, setSelectedDayForModal] = useState()
  // schedules
  const [schedules, setSchedules] = useState()
  // clients/projects
  const [clients, setClients] = useState()
  // sum time
  const [sumTime, setSumtime] = useState([0, 0, 0, 0, 0, 0, 0])

  const navigate = useNavigate()

  // today style
  const todayMark = {
    backgroundColor: '#b3d1ff',
  }

  // get clients
  useMemo(() => {
    axios
      .get('http://localhost:5000/api/clients')
      .then(resp => {
        if (resp?.data?.clients) {
          setClients(resp.data.clients)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  // get all schedules
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/defaults')
      .then(resp => {
        if (resp?.data?.schedules) {
          let scs = resp.data.schedules
          let newSumTimes = [0, 0, 0, 0, 0, 0, 0]
          scs.forEach((s, index) => {
            s.forEach(ins => {
              newSumTimes[index] += ins.uhours ? ins.uhours * 60 : 0
              newSumTimes[index] += ins.umins ? ins.umins : 0
            })
          })
          setSumtime(newSumTimes)
          setSchedules(scs)
        }
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    // get day
    let today = dateNow
    // set today day in week
    let todayDayNameNumber = dayjs().day()
    setTodayDay(todayDayNameNumber)
    // set today date
    let todayDate = today.format('DD. MMM YYYY.')
    // set week
    switch (todayDayNameNumber) {
      case 1:
        setCalDays([
          todayDate,
          today.add(1, 'days').format('DD. MMM YYYY.'),
          today.add(2, 'days').format('DD. MMM YYYY.'),
          today.add(3, 'days').format('DD. MMM YYYY.'),
          today.add(4, 'days').format('DD. MMM YYYY.'),
          today.add(5, 'days').format('DD. MMM YYYY.'),
          today.add(6, 'days').format('DD. MMM YYYY.'),
        ])
        break
      case 2:
        setCalDays([
          today.subtract(1, 'days').format('DD. MMM YYYY.'),
          todayDate,
          today.add(1, 'days').format('DD. MMM YYYY.'),
          today.add(2, 'days').format('DD. MMM YYYY.'),
          today.add(3, 'days').format('DD. MMM YYYY.'),
          today.add(4, 'days').format('DD. MMM YYYY.'),
          today.add(5, 'days').format('DD. MMM YYYY.'),
        ])
        break
      case 3:
        setCalDays([
          today.subtract(2, 'days').format('DD. MMM YYYY.'),
          today.subtract(1, 'days').format('DD. MMM YYYY.'),
          todayDate,
          today.add(1, 'days').format('DD. MMM YYYY.'),
          today.add(2, 'days').format('DD. MMM YYYY.'),
          today.add(3, 'days').format('DD. MMM YYYY.'),
          today.add(4, 'days').format('DD. MMM YYYY.'),
        ])
        break
      case 4:
        setCalDays([
          today.subtract(3, 'days').format('DD. MMM YYYY.'),
          today.subtract(2, 'days').format('DD. MMM YYYY.'),
          today.subtract(1, 'days').format('DD. MMM YYYY.'),
          todayDate,
          today.add(1, 'days').format('DD. MMM YYYY.'),
          today.add(2, 'days').format('DD. MMM YYYY.'),
          today.add(3, 'days').format('DD. MMM YYYY.'),
        ])
        break
      case 5:
        setCalDays([
          today.subtract(4, 'days').format('DD. MMM YYYY.'),
          today.subtract(3, 'days').format('DD. MMM YYYY.'),
          today.subtract(2, 'days').format('DD. MMM YYYY.'),
          today.subtract(1, 'days').format('DD. MMM YYYY.'),
          todayDate,
          today.add(1, 'days').format('DD. MMM YYYY.'),
          today.add(2, 'days').format('DD. MMM YYYY.'),
        ])
        break
      case 6:
        setCalDays([
          today.subtract(5, 'days').format('DD. MMM YYYY.'),
          today.subtract(4, 'days').format('DD. MMM YYYY.'),
          today.subtract(3, 'days').format('DD. MMM YYYY.'),
          today.subtract(2, 'days').format('DD. MMM YYYY.'),
          today.subtract(1, 'days').format('DD. MMM YYYY.'),
          todayDate,
          today.add(1, 'days').format('DD. MMM YYYY.'),
        ])
        break
      case 0:
        setCalDays([
          today.subtract(6, 'days').format('DD. MMM YYYY.'),
          today.subtract(5, 'days').format('DD. MMM YYYY.'),
          today.subtract(4, 'days').format('DD. MMM YYYY.'),
          today.subtract(3, 'days').format('DD. MMM YYYY.'),
          today.subtract(2, 'days').format('DD. MMM YYYY.'),
          today.subtract(1, 'days').format('DD. MMM YYYY.'),
          todayDate,
        ])
        break
    }
  }, [dateNow])

  const handleLogout = () => {
    logout()
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  const handleCloseModal = () => setOpenCreateModal(false)

  // handle date change
  const handleSetOneWeekLess = () => {
    setDateNow(prev => dayjs(prev).subtract(7, 'days'))
  }
  const handlesetOneWeekMore = () => {
    setDateNow(prev => dayjs(prev).add(7, 'days'))
  }
  const handleSetToday = () => {
    setDateNow(prev => dayjs())
  }

  // submit all
  const handleSubmitAll = (aDate, dayNmb) => {
    // set timezone for isoString to 00:00 => dayjs(aDate).add(1, 'hours').toISOString()
    let theDate = dayjs(aDate).add(1, 'hours').toISOString()
    // list all schedules
    if (schedules[dayNmb]?.length > 0) {
      schedules[dayNmb].forEach(sc => {
        let sendObj = {
          // project
          clientID: sc.project,
          clientName: clients.find(cli => cli['_id'] === sc.project).firstName,
          //date
          date: theDate,
          // developer (full name)
          developerID: user['_id'],
          developerName: user.firstName + ' ' + user.lastName,
          // specifics
          description: sc.description,
          estTime: sc.estTime,
          time: sc.time,
          task: sc.task,
        }
        // send request
        axios
          .post('http://localhost:5000/api/create-day-entrance', { sendObj, token })
          .then(response => {
            if (response?.data) {
              console.log(response.data)
            }
          })
          .catch(error => {
            console.error(error)
          })
      })
    }
  }

  return (
    <Container id='main-container'>
      <Header style={{ textAlign: 'center', padding: '2rem 0' }}>
        Dobrodosao {user?.firstName}
        <Button style={{ marginLeft: '2rem' }} onClick={handleLogout}>
          Logout
        </Button>
      </Header>

      <Message negative>
        <MessageHeader>
          {`* Raspored po danima se ucitava po sablonima prethodno kreiranim. `}
          <br />
          {`* Svaki edit direktno na ovom kalendaru je privremen za taj dan konkretno`}
        </MessageHeader>
      </Message>
      <Button onClick={handleSetOneWeekLess}>{`<`}</Button>
      <Button onClick={handleSetToday}>Today</Button>
      <Button onClick={handlesetOneWeekMore}>{`>`}</Button>
      <Table celled fixed>
        <TableHeader>
          <TableRow>
            <TableHeaderCell style={todayDay === 1 && rawToday.format('DD. MMM YYYY.') === calDays[0] ? todayMark : {}}>
              Ponedeljak <br /> {`${calDays[0] || ''}`}
            </TableHeaderCell>
            <TableHeaderCell style={todayDay === 2 && rawToday.format('DD. MMM YYYY.') === calDays[1] ? todayMark : {}}>
              Utorak <br /> {`${calDays[1] || ''}`}
            </TableHeaderCell>
            <TableHeaderCell style={todayDay === 3 && rawToday.format('DD. MMM YYYY.') === calDays[2] ? todayMark : {}}>
              Sreda <br /> {`${calDays[2] || ''}`}
            </TableHeaderCell>
            <TableHeaderCell style={todayDay === 4 && rawToday.format('DD. MMM YYYY.') === calDays[3] ? todayMark : {}}>
              Cetvrtak <br /> {`${calDays[3] || ''}`}
            </TableHeaderCell>
            <TableHeaderCell style={todayDay === 5 && rawToday.format('DD. MMM YYYY.') === calDays[4] ? todayMark : {}}>
              Petak <br /> {`${calDays[4] || ''}`}
            </TableHeaderCell>
            <TableHeaderCell style={todayDay === 6 && rawToday.format('DD. MMM YYYY.') === calDays[5] ? todayMark : {}}>
              Subota <br /> {`${calDays[5] || ''}`}
            </TableHeaderCell>
            <TableHeaderCell style={todayDay === 0 && rawToday.format('DD. MMM YYYY.') === calDays[6] ? todayMark : {}}>
              Nedelja <br /> {`${calDays[6] || ''}`}
            </TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Button onClick={() => navigate(`/upsert-schedule/0`)}>Kreiraj/edituj sablon za sve ponedeljke</Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => navigate(`/upsert-schedule/${1}`)}>Kreiraj/edituj sablon za sve utorke</Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => navigate(`/upsert-schedule/${2}`)}>Kreiraj/edituj sablon za sve srede</Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => navigate(`/upsert-schedule/${3}`)}>Kreiraj/edituj sablon za sve cetvrtke</Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => navigate(`/upsert-schedule/${4}`)}>Kreiraj/edituj sablon za sve petke</Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => navigate(`/upsert-schedule/${5}`)}>Kreiraj/edituj sablon za sve subote</Button>
            </TableCell>
            <TableCell>
              <Button onClick={() => navigate(`/upsert-schedule/${6}`)}>Kreiraj/edituj sablon za sve nedelje</Button>
            </TableCell>
          </TableRow>
          <TableRow style={{ backgroundColor: 'rgb(240, 243, 250)' }}>
            {schedules &&
              schedules.map((sc, index) => (
                <TableCell key={index} className='home-day'>
                  <Button
                    primary
                    size='mini'
                    onClick={() => {
                      setOpenCreateModal(true)
                      setSelectedDayForModal(calDays[index])
                    }}
                  >
                    Dodaj (samo za ovaj dan)
                  </Button>
                  <br />
                  <Button
                    size='mini'
                    style={{ marginTop: '5px' }}
                    primary
                    onClick={() => {
                      // setOpenCreateModal(true)
                      // setSelectedDayForModal(calDays[index])
                    }}
                  >
                    Resetuj na sablon
                  </Button>
                  {sc &&
                    sc.length > 0 &&
                    sc.map((ev, i) => (
                      <div key={i}>
                        <hr />
                        <p>Projekat: </p>
                        <p>
                          <em>
                            <strong>{clients && clients.find(cli => cli['_id'] === ev.project).firstName}</strong>
                          </em>
                        </p>
                        <p>Task:</p>
                        <p>
                          <em>
                            <strong>{ev.task}</strong>
                          </em>
                        </p>
                        <p>Opis:</p>
                        <p>
                          <em>
                            <strong>{ev.description}</strong>
                          </em>
                        </p>
                        <p>Utroseno vreme:</p>
                        <p>
                          <em>
                            <strong>
                              {ev.uhours ? ev.uhours : '0'} :{' '}
                              {ev.umins ? (ev.umins < 10 ? '0' + ev.umins : ev.umins) : '00'}
                            </strong>
                          </em>
                        </p>
                        <p>Estimirano vreme:</p>
                        <p style={{ color: 'gray' }}>
                          {ev.eshours ? ev.eshours : '0'} :{' '}
                          {ev.esmins ? (ev.esmins < 10 ? '0' + ev.esmins : ev.esmins) : '00'}
                        </p>
                        <Button size='mini'>Edit</Button>
                        <Button size='mini'>Remove</Button>
                      </div>
                    ))}
                </TableCell>
              ))}
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              Ukupno sati:{' '}
              {`${parseInt(sumTime[0] / 60)} : ${sumTime[0] % 60 < 10 ? '0' + (sumTime[0] % 60) : sumTime[0] % 60}`}
            </TableCell>
            <TableCell>
              Ukupno sati:{' '}
              {`${parseInt(sumTime[1] / 60)} : ${sumTime[1] % 60 < 10 ? '0' + (sumTime[1] % 60) : sumTime[1] % 60}`}
            </TableCell>
            <TableCell>
              Ukupno sati:{' '}
              {`${parseInt(sumTime[2] / 60)} : ${sumTime[2] % 60 < 10 ? '0' + (sumTime[2] % 60) : sumTime[2] % 60}`}
            </TableCell>
            <TableCell>
              Ukupno sati:{' '}
              {`${parseInt(sumTime[3] / 60)} : ${sumTime[3] % 60 < 10 ? '0' + (sumTime[3] % 60) : sumTime[3] % 60}`}
            </TableCell>
            <TableCell>
              Ukupno sati:{' '}
              {`${parseInt(sumTime[4] / 60)} : ${sumTime[4] % 60 < 10 ? '0' + (sumTime[4] % 60) : sumTime[4] % 60}`}
            </TableCell>
            <TableCell>
              Ukupno sati:{' '}
              {`${parseInt(sumTime[5] / 60)} : ${sumTime[5] % 60 < 10 ? '0' + (sumTime[5] % 60) : sumTime[5] % 60}`}
            </TableCell>
            <TableCell>
              Ukupno sati:{' '}
              {`${parseInt(sumTime[6] / 60)} : ${sumTime[6] % 60 < 10 ? '0' + (sumTime[6] % 60) : sumTime[6] % 60}`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Button
                onClick={() => {
                  handleSubmitAll(dayjs(calDays[0]), 0)
                }}
                primary
              >
                submit-uj sve unose za konkretno ovaj datum
              </Button>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  handleSubmitAll(dayjs(calDays[1]), 1)
                }}
                primary
              >
                submit-uj sve unose za konkretno ovaj datum
              </Button>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  handleSubmitAll(dayjs(calDays[2]), 2)
                }}
                primary
              >
                submit-uj sve unose za konkretno ovaj datum
              </Button>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  handleSubmitAll(dayjs(calDays[3]), 3)
                }}
                primary
              >
                submit-uj sve unose za konkretno ovaj datum
              </Button>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  handleSubmitAll(dayjs(calDays[4]), 4)
                }}
                primary
              >
                submit-uj sve unose za konkretno ovaj datum
              </Button>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  handleSubmitAll(dayjs(calDays[5]), 5)
                }}
                primary
              >
                submit-uj sve unose za konkretno ovaj datum
              </Button>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => {
                  handleSubmitAll(dayjs(calDays[6]), 6)
                }}
                primary
              >
                submit-uj sve unose za konkretno ovaj datum
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <CreateEventModal
        open={openCreateModal}
        closeModal={handleCloseModal}
        selectedDayForModal={selectedDayForModal}
      />
    </Container>
  )
}

export default Home
