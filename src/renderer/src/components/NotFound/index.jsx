import { Container, Header } from 'semantic-ui-react'

const NotFound = () => {
  return (
    <Container
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Header>Not Found 404</Header>
    </Container>
  )
}

export default NotFound
