import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

export default function loginPage(handleSubmit,toggleRegister, handleUsernameInput,
                                  togglePasswordVisibility,handlePasswordInput, showPassword) {

    return <form onSubmit={handleSubmit} className={'container-md login-form'}>
        <div className="banner">
            <div className="btn btn-primary">Login</div>
            <div onClick={toggleRegister} className="btn btn-secondary">
                Register
            </div>
        </div>
        <div className="input-group mb-3">
                    <span className="input-group-text w-15" id="basic-addon1"><div
                        className="password-toggle"></div></span>
            <input onChange={handleUsernameInput} type="text" className="form-control"
                   placeholder="Username"
                   aria-label="Username"
                   aria-describedby="basic-addon1"/>
        </div>
        <div className="input-group mb-3">
            <div className="input-group ">
                        <span onClick={togglePasswordVisibility} className="input-group-text w-15" id="basic-addon1">
                                <FontAwesomeIcon
                                    className={'password-toggle'}
                                    icon={showPassword ? faEyeSlash : faEye}
                                    style={{cursor: 'pointer', color: 'black'}}
                                />
                        </span>

                <input onChange={handlePasswordInput} type={showPassword ? 'text' : 'password'}
                       className="form-control"
                       placeholder="Password"
                       aria-label="Password" aria-describedby="basic-addon2"/>
            </div>
        </div>
        <button type="submit" className="btn mb-3 btn-primary">
            Submit
        </button>
    </form>

}