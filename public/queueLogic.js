class QueueCalculator {
    // Situación 1: M/M/1
    static calcularMM1(lambda, mu) {
        const rho = lambda / mu;
        const p0 = 1-rho;
 /*       if (rho >= 1) {
            throw new Error("El sistema es inestable (ρ >= 1)");
        }*/

        return  {
            p0: p0,
            rho: rho,
            L: rho / (1 - rho),
            Lq: Math.pow(lambda, 2) / (mu*(mu - lambda)),
            W: 1 / (mu - lambda),
            Wq: rho / (mu - lambda),
            Pn: Math.pow(rho, 1) * p0
        };
    }

    

    // Situación 2: M/M/s
    static calcularMMs(lambda, mu, s) {
        const rho = lambda / (s * mu);
        if (rho >= 1) {
            throw new Error("El sistema es inestable (ρ >= 1)");
        }

        // Cálculo de P0 (probabilidad de sistema vacío)
        let sum = 0;
        for (let n = 0; n < s; n++) {
            sum += Math.pow(lambda/mu, n) / this.factorial(n);
        }
        const p0 = 1 / (sum + (Math.pow(lambda/mu, s) / this.factorial(s)) * (1/(1-rho)));

        const Lq = (Math.pow(lambda/mu, s) * lambda * mu * p0) / 
                   (this.factorial(s-1) * Math.pow(s*mu - lambda, 2));
        
        return {
            p0: p0,
            rho: rho,
            L: Lq + lambda/mu,
            Lq: Lq,
            W: (Lq + lambda/mu) / lambda,
            Wq: Lq / lambda
        };
    }

    // Situación 3: M/G/1
    static calcularMG1(lambda, mu, sigma) {
        const rho = lambda / mu;
        const p0 = 1 - rho;
        if (rho >= 1) {
            throw new Error("El sistema es inestable (ρ >= 1)");
        }

        const lq = (((Math.pow(lambda, 2)) * (Math.pow(sigma, 2))) + ((Math.pow(rho, 2)))) / (2 * p0);

        return {
            p0:p0,
            rho: rho,
            L: lq + rho,
            Lq: lq,
            W: (lq + rho) / lambda,
            Wq: lq / lambda
        };
    }

    // Situación 4: M/G/s (aproximación)
    static calcularMGs(lambda, mu, s, sigma) {
        const rho = lambda / (s * mu);
        if (rho >= 1) {
            throw new Error("El sistema es inestable (ρ >= 1)");
        }

        // Esta es una aproximación simplificada
        const MMsResults = this.calcularMMs(lambda, mu, s);
        const factor = (1 + sigma * Math.pow(mu, 2));
        
        return {
            rho: rho,
            L: MMsResults.L * factor,
            Lq: MMsResults.Lq * factor,
            W: MMsResults.W * factor,
            Wq: MMsResults.Wq * factor
        };
    }

    // Situación 5: M/M/1/K
    static calcularMM1K(lambda, mu, K) {
        const rho = lambda / mu;
        let p0;
        
        if (rho === 1) {
            p0 = 1 / (K + 1);
        } else {
            p0 = (1 - rho) / (1 - Math.pow(rho, K + 1));
        }

        const L = rho * (1 - (K + 1) * Math.pow(rho, K) + K * Math.pow(rho, K + 1)) /
                 ((1 - rho) * (1 - Math.pow(rho, K + 1)));

        let numerator = Math.pow(rho, K) * lambda * mu;
        let denominator = this.factorial(K - 1) * Math.pow((K * mu - lambda), 2);
        let Lq = (numerator / denominator) * p0;
        
        const lambdaEff = lambda * (1 - this.calcularPK(lambda, mu, K));
        
        return {
            p0:p0,
            rho: rho,
            L: L,
            Lq : Lq,
            lambdaEff: lambdaEff,
            W: L / lambdaEff,
            PK: this.calcularPK(lambda, mu, K)
        };
    }

    static calcularPK(lambda, mu, K) {
        const rho = lambda / mu;
        if (rho === 1) {
            return 1 / (K + 1);
        }
        return Math.pow(rho, K) * (1 - rho) / (1 - Math.pow(rho, K + 1));
    }

    static factorial(n) {
        if (n === 0 || n === 1) {
        return 1;
    }
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
    }
}