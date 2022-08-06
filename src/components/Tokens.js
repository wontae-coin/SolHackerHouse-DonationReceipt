function Tokens(tokens) {
    return (
        <div>
            {tokens.map( (token, index) => (
                <div key={index}>
                    {token}
                </div>
            ))}
        </div>
    );

}

export {Tokens};