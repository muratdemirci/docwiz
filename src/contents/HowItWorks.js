import React from 'react'
import { Text, Image } from '@geist-ui/react'
import { useTheme } from '@geist-ui/react'
import logo from './howitworks.png'

const HowItWorks = () => {
  const { palette } = useTheme()
  return (
    <div className="condiv">
      <Text h1 style={{ color: palette.violet }}>
        Nasıl Çalışır?
      </Text>

      <Text>
        Hızlı başlangıç sekmesinden postman çıktısı dosyanızı yüklerseniz,
        editör açılır ve dosyanızı readme olarak düzenlemeye başlarsınız :) not:
        proje içerisinde örnek dosya mevcut :)
      </Text>

      <Image src={logo} />
    </div>
  )
}

export default HowItWorks
