
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';


function Rating({value, text, color}) {
  return (
    <div className="rating">
        {/*  */}
      <span> {/* 1. div tüm ekranı kaplarken span wraps the content mesela 3 tane alt alta div yazdın ya tek harf bile yazsan tüm ekranın genişliğini kaplar ama span sadece tek harfi kaplar ve alt alta 3 div yazarsan alt alta gözükür çünkü her biri tüm genişliği kapatıyor. ama 3 tane alt alta span yazarsan yan yana gözükürler çünkü kelime bittikten sonraki alan boşta olur hala orayı doldururlar. */}
        {/*2. i tagi metni italik olarak vurgulamanı sağlar, burada style html kısmı yani renk sadece ama className ise aslında yıldızların tam dolu olup olmadığını belirleyeceğimiz kısım  */}
        <i style={{color}} className={
                value >= 1
                    ? 'fas fa-star' //3. bu normal yıldız ve if koşulunu nasıl kullandığımıza bak
                    : value >= 0.5
                        ? 'fas fa-star-half-alt'
                        : 'far fa-star' // boş yıldız
        }> 

        </i>
      </span>

      <span> 
        <i style={{color}} className={
                value >= 2
                    ? 'fas fa-star' //3. bu normal yıldız ve if koşulunu nasıl kullandığımıza bak
                    : value >= 1.5
                        ? 'fas fa-star-half-alt'
                        : 'far fa-star' // boş yıldız
        }> 

        </i>
      </span>

      <span> 
        <i style={{color}} className={
                value >= 3
                    ? 'fas fa-star' //3. bu normal yıldız ve if koşulunu nasıl kullandığımıza bak
                    : value >= 2.5
                        ? 'fas fa-star-half-alt'
                        : 'far fa-star' // boş yıldız
        }> 

        </i>
      </span>

      <span> 
        <i style={{color}} className={
                value >= 4
                    ? 'fas fa-star' //3. bu normal yıldız ve if koşulunu nasıl kullandığımıza bak
                    : value >= 3.5
                        ? 'fas fa-star-half-alt'
                        : 'far fa-star' // boş yıldız
        }> 

        </i>
      </span>

      <span> 
        <i style={{color}} className={
                value >= 5
                    ? 'fas fa-star' //3. bu normal yıldız ve if koşulunu nasıl kullandığımıza bak
                    : value >= 4.5
                        ? 'fas fa-star-half-alt'
                        : 'far fa-star' // boş yıldız
        }> 

        </i>
      </span>

      <span>{text && text}</span>  {/*4. buraya da yazımızı ekliyoruz yıldızların yanına. bu yazış şekli de şey demek rating varsa yaz demek yanına  */}
        {/* 5. index.css egidiyorum çünkü yıkarıda rating classını kullanmıştık onu implement edicem */}
        {/* 6. README git */}
    </div>
  )
}

export default Rating
