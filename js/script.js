$(document).ready(function() {

    function inserir() {

        $("#form_cadastro").validate({
            submitHandler: function(form) {
                $("input").each(function() {
                    console.log($(this).val());
                    return;
                });
            }
        });
    }

    $("#btn_salvar").click(function() {
        inserir();
    });

    $("#cpf").mask("999.999.999-99");
    $("#celular").mask("(99) 99999-9999");
    $("#cep").mask("99.999-999");

    /**Validacao jquery campos */
    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo é obrigatório...",
        number: "Este campo deve ser numérico...",
        email: "Email inválido..."
    });

    function limpa_formulario_cep(msg) {
        Swal.fire(
            'Erro!',
            "" + msg + "...",
            'error'
        ).then(function() {
            $("#cep").html("");
            $("#cep").val("");
            return false;
        });
    }

    $("#cep").blur(function() {

        //Nova variável "cep" somente com numeros.
        var cep = $(this).val().replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if (validacep.test(cep)) {
                $.ajax({
                    dataType: "json",
                    type: 'GET',
                    url: "https://api.postmon.com.br/v1/cep/" + cep,
                    crossDomain: true,
                    success: function(dados) {
                        $("#bairro").val(dados.bairro);
                        $("#uf").val(dados.estado);
                        $("#cidade").val(dados.cidade);
                        if (dados.logradouro) {
                            $("#logradouro").val(dados.logradouro);
                        }

                    },
                    error: function() {
                        //Alguns CEPS nao estao disponiveis como eh o caso do 97542430 entao removi a msg de erro e deixei o cep igual a como o usuario digitou 
                    }
                });


            } else {
                //cep é inválido.
                limpa_formulario_cep("Este CEP é inválido");
            }
        } else {
            //cep sem valor, limpa formulário.
            limpa_formulario_cep("CEP em branco");
        }
    });

    //Creditos para: http://www.darcweb.com.br/posts/view/1/620/Validacao+de+CPF+com+jQuery.dhtml
    jQuery.validator.addMethod("verificaCPF", function(value, element) {
        value = value.replace('.', '');
        value = value.replace('.', '');
        cpf = value.replace('-', '');
        while (cpf.length < 11) cpf = "0" + cpf;
        var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
        var a = [];
        var b = new Number;
        var c = 11;
        for (i = 0; i < 11; i++) {
            a[i] = cpf.charAt(i);
            if (i < 9) b += (a[i] * --c);
        }
        if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11 - x }
        b = 0;
        c = 11;
        for (y = 0; y < 10; y++) b += (a[y] * c--);
        if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11 - x; }
        if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) return false;
        return true;
    }, "Informe um CPF válido."); // Mensagem padrão

    //Validacao do form:
    $("#form_cadastro").validate({
        rules: {
            nome_completo: {
                required: true
            },
            data_nascimento: {
                required: true
            },
            cpf: {
                required: true,
                minlength: 14,
                maxlength: 14,
                verificaCPF: true
            },
            tipo: {
                required: true
            },
            email: {
                required: true,
                email: true
            },
            telefone: {
                required: true,
                minlength: 15,
                maxlength: 15
            },
            cep: {
                required: true,
                minlength: 10,
                maxlength: 10
            },
            endereco: {
                required: true
            }
        },
        messages: {
            cpf: {
                minlength: jQuery.format("Digite pelo menos 11 caracteres"),
                maxlength: jQuery.format("Digite no máximo 14 caracteres"),
                verificaCPF: "CPF inválido"
            },
            telefone: {
                minlength: jQuery.format("Seu telefone deve conter exatemente 11 números"),
                maxlength: jQuery.format("Seu telefone deve conter exatemente 11 números")
            },
            cep: {
                required: "Este campo é obrigatorio",
                minlength: jQuery.format("Seu CEP deve conter exatemente 8 números"),
                maxlength: jQuery.format("Seu CEP deve conter exatemente 8 números")

            }
        },
        errorPlacement: function(error, element) {
            if ($(element).is('select')) {
                element.next().after(error);
            } else {
                error.insertAfter(element);
            }
        },
        errorElement: 'span',
        highlight: function(element) {
            $(element).next().addClass('validation-error-message help-block form-helper bold');
            $(element).parents('.form-group').removeClass('has-feedback has-success');
            $(element).parents('.form-group').addClass('bold has-feedback has-error');
        },
        unhighlight: function(element) {
            $(element).parents('.form-group').removeClass('has-feedback has-error');
            $(element).parents('.form-group').addClass('has-feedback has-success');
        }
    });

});