import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'

import { Container, SSRProvider } from 'react-bootstrap'
import '@/styles/login.scss'
import "../styles/bootstrap.css";
import { store, persistor } from '@/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import MainNavigation from './components/MainNavigation'
import Footer from './components/Footer'

export default function App({ Component, pageProps }) {
  return (
    <SSRProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
  
          <MainNavigation />
          <main className='py-3'>
            <Container>
              <Component {...pageProps} />
              </Container>
            </main>
          <Footer />
        </PersistGate>
      </Provider>
    </SSRProvider>
  )
}
