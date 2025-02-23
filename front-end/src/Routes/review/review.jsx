import Feedback from "../../components/Feedback/Feedback"

const review = () => {
    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '-0.5rem',
                marginBottom: '-0.5rem'
            }}
        >
            <Feedback />
        </div>
    )
}

export default review
