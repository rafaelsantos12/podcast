import format from 'date-fns/format';
import styles from './style.module.scss';
import ptBR from 'date-fns/locale/pt-BR';


export default function Header(){

    const currentDate = format(new Date(), 'EEEEEE, d MMMM',{
        locale: ptBR,
    });

    return(
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podecast"/>

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
    );
}